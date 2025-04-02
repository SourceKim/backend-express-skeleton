import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Permission } from '@/models/permission.model';
import {
    CreatePermissionDto,
    UpdatePermissionDto,
    PermissionResponseDto
} from '@/dtos/permission.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginatedResponse } from '@/dtos/common.dto';

export class PermissionService {
    private permissionRepository: Repository<Permission>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
    }

    async findAllPermissions(page: number = 1, limit: number = 20, sort_by: string = 'created_at', sort_order: 'ASC' | 'DESC' = 'DESC'): Promise<PaginatedResponse<PermissionResponseDto>> {
        try {
            const [permissions, total] = await this.permissionRepository.findAndCount({
                order: { [sort_by]: sort_order },
                skip: (page - 1) * limit,
                take: limit
            });
            
            const pages = Math.ceil(total / limit);
            
            return {
                items: permissions.map(permission => ({
                    id: permission.id,
                    name: permission.name,
                    resource: permission.resource,
                    action: permission.action,
                    description: permission.description,
                    created_at: permission.created_at,
                    updated_at: permission.updated_at
                })),
                meta: {
                    total,
                    page,
                    limit,
                    pages,
                    sort_by,
                    sort_order
                }
            };
        } catch (error) {
            console.error('获取所有权限失败:', error);
            throw new HttpException(500, '获取所有权限失败');
        }
    }

    async findPermissionById(id: string): Promise<PermissionResponseDto | null> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) return null;

        return {
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            created_at: permission.created_at,
            updated_at: permission.updated_at
        };
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
        // 检查权限名称是否已存在
        const existingPermission = await this.permissionRepository.findOne({
            where: { name: createPermissionDto.name }
        });

        if (existingPermission) {
            throw new HttpException(400, '权限名称已存在');
        }

        const permission = this.permissionRepository.create(createPermissionDto);
        await this.permissionRepository.save(permission);

        return {
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            created_at: permission.created_at,
            updated_at: permission.updated_at
        };
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionResponseDto | null> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) return null;

        // 如果要更新名称，检查新名称是否已存在
        if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
            const existingPermission = await this.permissionRepository.findOne({
                where: { name: updatePermissionDto.name }
            });

            if (existingPermission) {
                throw new HttpException(400, '权限名称已存在');
            }
        }

        // 更新权限属性
        if (updatePermissionDto.name) permission.name = updatePermissionDto.name;
        if (updatePermissionDto.resource) permission.resource = updatePermissionDto.resource;
        if (updatePermissionDto.action) permission.action = updatePermissionDto.action;
        if (updatePermissionDto.description !== undefined) permission.description = updatePermissionDto.description;

        await this.permissionRepository.save(permission);

        return {
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            created_at: permission.created_at,
            updated_at: permission.updated_at
        };
    }

    async deletePermission(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }
} 