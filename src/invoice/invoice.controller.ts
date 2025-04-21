import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
import { JwtAuthGuard } from '../auth/JwtAuthGuard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create an invoice' })
  async createInvoice(@Req() req, @Body() createInvoiceDto: CreateInvoiceDto) {
    const userId = req.user.id; 
    return this.invoiceService.createInvoice(userId, createInvoiceDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  findAll(@Body('userId') userId: string) {
    return this.invoiceService.getAllInvoices(userId);
  }
    
  @Get(':invoiceId')
async getInvoice(@Param('invoiceId') invoiceId: string, @Req() req) {
  const userId = req.user.id; 
  return this.invoiceService.getInvoiceById(userId, invoiceId);
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
