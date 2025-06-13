"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const app_utilities_1 = require("../../app.utilities");
const common_1 = require("@nestjs/common");
let CrudService = class CrudService {
    constructor(delegate) {
        this.delegate = delegate;
    }
    getDelegate() {
        return this.delegate;
    }
    setDelegate(delegate) {
        this.delegate = delegate;
    }
    async aggregate(data) {
        return await this.delegate.aggregate(data);
    }
    async count(data) {
        return await this.delegate.count(data);
    }
    async create(data) {
        return this.delegate.create(data);
    }
    async createMany(data) {
        return this.delegate.createMany(data);
    }
    async delete(data, authUser) {
        try {
            return await this.delegate.delete(data);
        }
        catch (error) {
            if (error?.code === 'P2003') {
                throw new common_1.NotAcceptableException("Record cannot be deleted because it's linked to other record(s)");
            }
            throw error;
        }
    }
    async deleteMany(data) {
        return this.delegate.deleteMany(data);
    }
    async findFirst(data) {
        return this.delegate.findFirst(data);
    }
    async findFirstOrThrow(data, errorOrMessage) {
        const result = await this.delegate.findFirst(data);
        if (!result) {
            const error = errorOrMessage && typeof errorOrMessage === 'string'
                ? new common_1.NotFoundException(errorOrMessage)
                : errorOrMessage;
            throw error || new common_1.NotFoundException('Record not found!');
        }
        return result;
    }
    async findMany(data) {
        return this.delegate.findMany(data);
    }
    async findUnique(data) {
        return this.delegate.findUnique(data);
    }
    async findUniqueOrThrow(data, errorOrMessage) {
        const result = await this.delegate.findUnique(data);
        if (!result) {
            const error = errorOrMessage && typeof errorOrMessage === 'string'
                ? new common_1.NotFoundException(errorOrMessage)
                : errorOrMessage;
            throw error || new common_1.NotFoundException('Record not found!');
        }
        return result;
    }
    async update(data) {
        return this.delegate.update(data);
    }
    async updateMany(data) {
        return this.delegate.updateMany(data);
    }
    async upsert(data) {
        return this.delegate.upsert(data);
    }
    async archive(id, authUser) {
        return this.delegate.update({
            where: { id },
            data: { status: false, updatedBy: authUser.user.userId },
        });
    }
    async restoreArchived(id, authUser) {
        return this.delegate.update({
            where: { id },
            data: { status: true, updatedBy: authUser.user.userId },
        });
    }
    parseQueryFilter({ term, ...filters }, querySchema) {
        let parsedTermFilters;
        const parsedFilters = {
            ...this.parseProps(filters, querySchema),
            ...this.parseOneToOne(filters, querySchema),
            ...this.parseOneToMany(filters, querySchema),
            ...this.parseFilterFunction(filters, querySchema),
        };
        if (term) {
            const parsedFilters = {
                ...this.parseProps({ term }, querySchema),
                ...this.parseOneToOne({ term }, querySchema),
                ...this.parseOneToMany({ term }, querySchema),
                ...this.parseFilterFunction({ term }, querySchema),
            };
            parsedTermFilters = {
                OR: Object.entries(parsedFilters || {}).map(([key, val]) => ({
                    [key]: val,
                })),
            };
        }
        return {
            ...parsedFilters,
            ...parsedTermFilters,
        };
    }
    async findManyPaginate(args, params = {}, dataMapper) {
        const { size = 25, cursor, orderBy: mOrderBy = args?.orderBy || 'createdAt', direction = 'desc', isPaginated = 'true', paginationType, page = 1, } = params;
        const orderBy = typeof mOrderBy === 'string' ? { [mOrderBy]: direction } : mOrderBy;
        if (isPaginated.toString().toLowerCase() === 'false') {
            return this.findMany({ ...args, orderBy });
        }
        if (paginationType === 'page') {
            const paginateData = {};
            const take = size ? parseInt(size) : 25;
            paginateData.skip = (parseInt(page) - 1) * take;
            paginateData.take = take;
            const orderByCol = typeof mOrderBy === 'string' ? mOrderBy : undefined;
            let results = await this.findMany({
                ...args,
                ...paginateData,
                orderBy: {
                    [orderByCol || 'createdAt']: direction ? direction : 'desc',
                },
            });
            const count = (await this.count({
                select: { id: true },
                where: args.where,
            }))?.id || 0;
            if (dataMapper && Array.isArray(results)) {
                let $__cachedData = {};
                results = await Promise.all(results.map(async (result) => {
                    const { $__cachedData: sharedCachedData, ...mResult } = await dataMapper(result, results, $__cachedData);
                    if (sharedCachedData) {
                        $__cachedData = sharedCachedData;
                    }
                    return mResult;
                }));
            }
            return {
                pageItems: results,
                pageMeta: {
                    itemCount: results.length,
                    totalItems: count,
                    itemsPerPage: take,
                    totalPages: Math.ceil(count / take),
                    currentPage: page,
                },
            };
        }
        const totalCount = (await this.delegate.count({
            select: { id: true },
            where: args.where,
        }))?.id || 0;
        let decodedCursor = {};
        if (cursor) {
            try {
                decodedCursor = JSON.parse(app_utilities_1.AppUtilities.decode(cursor));
                args = {
                    ...args,
                    orderBy,
                    skip: decodedCursor.id ? 1 : 0,
                    take: (((decodedCursor.last && totalCount % Number(size)) ||
                        Number(size)) +
                        1) *
                        decodedCursor.dir,
                    ...(decodedCursor.id && { cursor: { id: decodedCursor.id } }),
                };
            }
            catch (error) {
                throw new common_1.NotAcceptableException('Invalid cursor!');
            }
        }
        else {
            args.take = size + 1;
            args.orderBy = orderBy;
        }
        let results = await this.delegate.findMany(args);
        if (dataMapper && Array.isArray(results)) {
            let $__cachedData = {};
            results = await Promise.all(results.map(async (result) => {
                const { $__cachedData: sharedCachedData, ...mResult } = await dataMapper(result, results, $__cachedData);
                if (sharedCachedData) {
                    $__cachedData = sharedCachedData;
                }
                return mResult;
            }));
        }
        let first = null;
        let previous = null;
        let next = null;
        let last = null;
        if (Array.isArray(results) && !!results.length) {
            const hasPrevious = (decodedCursor.id &&
                (decodedCursor.dir === 1 || results.length > size)) ||
                (decodedCursor.last && totalCount > results.length) ||
                null;
            const hasNext = (decodedCursor.id && decodedCursor.dir === -1) ||
                (!decodedCursor.last && results.length > size) ||
                null;
            if (results.length > size) {
                [1, undefined].includes(decodedCursor.dir)
                    ? results.pop()
                    : results.shift();
            }
            first = hasPrevious && {
                cursor: app_utilities_1.AppUtilities.encode(JSON.stringify({ first: true, dir: 1 })),
            };
            last = hasNext && {
                cursor: app_utilities_1.AppUtilities.encode(JSON.stringify({
                    last: true,
                    dir: -1,
                })),
            };
            const previousCursor = app_utilities_1.AppUtilities.encode(JSON.stringify({ id: results[0].id, dir: -1 }));
            previous = hasPrevious && {
                cursor: previousCursor,
                page: null,
                isCurrent: false,
            };
            const nextCursor = app_utilities_1.AppUtilities.encode(JSON.stringify({ id: results[results.length - 1].id, dir: 1 }));
            next = hasNext && {
                cursor: nextCursor,
                page: null,
                isCurrent: false,
            };
        }
        return {
            pageEdges: results.map((result) => ({ cursor: null, node: result })),
            pageCursors: { first, previous, next, last },
            totalCount,
        };
    }
    parseProps({ term, ...filters }, querySchema) {
        return querySchema.reduce((acc, q) => {
            const [key, modifier = 'contains'] = String(q).split('|');
            if (typeof q === 'string' &&
                !q.match(/[\.:]/) &&
                (typeof filters[String(key)] !== 'undefined' ||
                    (!!term && modifier === 'contains'))) {
                const mode = modifier === 'contains' ? { mode: 'insensitive' } : {};
                acc[String(key)] = {
                    [modifier]: filters[String(key)] || term,
                    ...mode,
                };
            }
            return acc;
        }, {});
    }
    parseOneToOne({ term, ...filters }, querySchema) {
        return querySchema.reduce((acc, q) => {
            if (typeof q !== 'string' || q.indexOf('.') === -1) {
                return acc;
            }
            const [key, modifier = 'contains'] = String(q).split('|');
            const [parent, relation] = String(key).split('.');
            if ((typeof filters[relation] === 'undefined' && !term) ||
                (!!term && modifier !== 'contains')) {
                return acc;
            }
            const mode = modifier === 'contains' ? { mode: 'insensitive' } : {};
            if (!acc[parent]) {
                acc[parent] = term ? { OR: [] } : { AND: [] };
            }
            const aggregator = term ? acc[parent].OR : acc[parent].AND;
            aggregator.push({
                [relation]: {
                    [modifier]: filters[relation] || term,
                    ...mode,
                },
            });
            return acc;
        }, {});
    }
    parseOneToMany({ term, ...filters }, querySchema) {
        return querySchema.reduce((acc, q) => {
            if (typeof q !== 'string' || q.indexOf(':') === -1) {
                return acc;
            }
            const [key, modifier = 'contains'] = String(q).split('|');
            const [parent, relation] = String(key).split(':');
            if ((typeof filters[relation] === 'undefined' && !term) ||
                (!!term && modifier !== 'contains')) {
                return acc;
            }
            const mode = modifier === 'contains' ? { mode: 'insensitive' } : {};
            acc[parent] = {
                some: {
                    [relation]: {
                        [modifier]: filters[relation] || term,
                        ...mode,
                    },
                },
            };
            return acc;
        }, {});
    }
    parseFilterFunction(filters, querySchema) {
        const parsed = querySchema.reduce((acc, q) => {
            if (typeof q !== 'string' && typeof filters[q.key] !== 'undefined') {
                const query = q.where(filters[q.key], filters);
                if (query)
                    acc.push(query);
            }
            return acc;
        }, []);
        return parsed.length ? { AND: parsed } : undefined;
    }
};
exports.CrudService = CrudService;
exports.CrudService = CrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], CrudService);
//# sourceMappingURL=crud.service.js.map