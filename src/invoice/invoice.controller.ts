import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  Delete, 
  UseGuards, 
  Req,
  Res, // ✅ ADD THIS
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express'; // ✅ ADD THIS
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
import { JwtAuthGuard } from '../auth/JwtAuthGuard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service'
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService,
     private readonly prisma: PrismaService, 
  ) {}

  @Get('templates')
  async getTemplates() {
    return this.invoiceService.getTemplates();
  }

  @Get('templates/:template/preview')
  async getTemplatePreview(
    @Param('template') template: string,
    @Req() req: any,
    @Res() res: Response, 
  ) {
    try {
      const validTemplates = ['MODERN', 'BLUE_MODERN', 'RED_ELEGANT'];
      if (!validTemplates.includes(template)) {
        return res.status(400).json({
          message: 'Invalid template. Choose MODERN, BLUE_MODERN, or RED_ELEGANT',
        });
      }

      const pdfBuffer = await this.invoiceService.generateTemplatePreview(
        template,
        req.user.id, // ✅ Changed from userId to id (match your other routes)
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${template.toLowerCase()}-preview.pdf"`,
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Template preview error:', error);
      return res.status(500).json({
        message: 'Failed to generate template preview',
        error: error.message,
      });
    }
  }


 @Get(':id/pdf')
async downloadInvoicePdf(
  @Param('id') invoiceId: string,
  @Req() req: any,
  @Res() res: Response,
) {
  try {
    // 1. Ensure this method returns items, client, taxAmount, and invoiceDiscount
    const invoice = await this.invoiceService.findInvoiceByIdAndUserId(
      invoiceId,
      req.user.id,
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });   

    const pdfBuffer = await this.invoiceService.generateBusinessCopyPdf(
      invoice,
      user,
      invoice.client, // Ensure client is loaded
    );

    const filename = `BUSINESS-COPY-${invoice.invoiceNumber || invoice.id.slice(0, 8)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate PDF' });
  }
}

@Public()
  @Get('pdf/public/:invoiceId')
  async getPublicInvoicePdf(
    @Param('invoiceId') invoiceId: string,
    @Res() res: Response,
  ) {
    try {
      // Fetch invoice with all relations
      const invoice = await this.invoiceService.findInvoiceById(invoiceId);

      if (!invoice) {
        return res.status(HttpStatus.NOT_FOUND).json({ 
          message: 'Invoice not found' 
        });
      }

      // Fetch user and client
      const [user, client] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: invoice.userId },
          include: { businessProfile: true },
        }),
        this.prisma.client.findUnique({
          where: { id: invoice.clientId },
        }),
      ]);

      if (!user || !client) {
        return res.status(HttpStatus.NOT_FOUND).json({ 
          message: 'Invoice data incomplete' 
        });
      }

      // Generate PDF buffer
      const pdfBuffer = await this.invoiceService.generateBusinessCopyPdf(
        invoice,
        user,
        client,
      );

      // Set headers for PDF download
      const filename = `Invoice-${invoice.invoiceNumber || invoice.id.slice(0, 8)}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // inline = view in browser
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow cross-origin access

      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating public PDF:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        message: 'Failed to generate PDF' 
      });
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create an invoice' })
  async createInvoice(@Req() req, @Body() createInvoiceDto: CreateInvoiceDto) {
    const userId = req.user.id; 
    return this.invoiceService.createInvoice(userId, createInvoiceDto);
  }

  @Get()
  async getAll(@Req() req) {
    const userId = req.user.id;  
    return this.invoiceService.getAllInvoices(userId);
  }

  // ✅ This route MUST come AFTER template routes
  @Get(':invoiceId')
  async getInvoice(@Param('invoiceId') invoiceId: string, @Req() req) {
    const userId = req.user.id; 
    return this.invoiceService.findInvoiceByIdAndUserId(userId, invoiceId);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update an invoice' })
  update(
    @Req() req,
    @Param('id') invoiceId: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    const userId = req.user.id;
    return this.invoiceService.updateInvoice(userId, invoiceId, updateInvoiceDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete an invoice' })
  remove(@Req() req, @Param('id') invoiceId: string) {
    const userId = req.user.id;
    return this.invoiceService.deleteInvoice(userId, invoiceId);
  }
}