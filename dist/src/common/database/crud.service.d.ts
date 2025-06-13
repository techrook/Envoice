import { RequestWithUser } from '../interfaces/index';
import { HttpException } from '@nestjs/common';
import { CrudMapType } from '../interfaces/crud-map-type.interface';
import { Delegate } from '../interfaces/delegate.interface';
type QuerySchema = {
    key: string;
    where: (val?: any, obj?: any) => any;
};
export declare abstract class CrudService<D extends Delegate, T extends CrudMapType> {
    protected delegate: D;
    constructor(delegate: D);
    getDelegate(): D;
    setDelegate(delegate: D): void;
    aggregate(data: T['aggregate']): Promise<unknown>;
    count(data: T['count']): Promise<any>;
    create(data: T['create']): Promise<unknown>;
    createMany(data: T['createMany']): Promise<unknown>;
    delete(data: T['delete'], authUser?: RequestWithUser): Promise<unknown>;
    deleteMany(data: T['deleteMany']): Promise<unknown>;
    findFirst(data: T['findFirst']): Promise<any>;
    findFirstOrThrow(data: T['findFirst'], errorOrMessage?: string | HttpException): Promise<any>;
    findMany(data: T['findMany']): Promise<any>;
    findUnique(data: T['findUnique']): Promise<unknown>;
    findUniqueOrThrow(data: T['findUnique'], errorOrMessage?: string | HttpException): Promise<unknown>;
    update(data: T['update']): Promise<unknown>;
    updateMany(data: T['updateMany']): Promise<unknown>;
    upsert(data: T['upsert']): Promise<unknown>;
    archive(id: string, authUser: RequestWithUser): Promise<unknown>;
    restoreArchived(id: string, authUser: RequestWithUser): Promise<unknown>;
    parseQueryFilter({ term, ...filters }: Record<string, any>, querySchema: (string | QuerySchema)[]): any;
    findManyPaginate(args: any, params?: any, dataMapper?: (row: any, data?: any[], cachedData?: any) => any): Promise<any>;
    private parseProps;
    private parseOneToOne;
    private parseOneToMany;
    private parseFilterFunction;
}
export {};
