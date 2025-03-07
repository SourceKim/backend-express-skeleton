import { In, Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { Permission } from '@/models/permission.model';
import { Role } from '@/models/role.model';
import { User } from '@/models/user.model';
import {
    CreatePermissionDto,
    UpdatePermissionDto,
    CreateRoleDto,
    UpdateRoleDto,
    AssignPermissionsDto,
    AssignRolesDto,
    PermissionResponseDto,
    RoleResponseDto,
    UserRolesResponseDto
} from '@/dtos/permission.dto';
import { HttpException } from '@/exceptions/http.exception';

export class PermissionService {
    private permissionRepository: Repository<Permission>;
    private roleRepository: Repository<Role>;
    private userRepository: Repository<User>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
        this.roleRepository = AppDataSource.getRepository(Role);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAllPermissions(): Promise<PermissionResponseDto[]> {
        const permissions = await this.permissionRepository.find();
        return permissions.map(permission => ({
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            created_at: permission.created_at,
            updated_at: permission.updated_at
        }));
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
        const permission = this.permissionRepository.create(createPermissionDto);
        const savedPermission = await this.permissionRepository.save(permission);
        
        return {
            id: savedPermission.id,
            name: savedPermission.name,
            resource: savedPermission.resource,
            action: savedPermission.action,
            description: savedPermission.description,
            created_at: savedPermission.created_at,
            updated_at: savedPermission.updated_at
        };
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionResponseDto> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new HttpException(404, '权限不存在');
        }

        Object.assign(permission, updatePermissionDto);
        const updatedPermission = await this.permissionRepository.save(permission);

        return {
            id: updatedPermission.id,
            name: updatedPermission.name,
            resource: updatedPermission.resource,
            action: updatedPermission.action,
            description: updatedPermission.description,
            created_at: updatedPermission.created_at,
            updated_at: updatedPermission.updated_at
        };
    }

    async deletePermission(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }

    async findAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.roleRepository.find({
            relations: ['permissions']
        });
        return roles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions.map(p => ({
                id: p.id,
                name: p.name,
                resource: p.resource,
                action: p.action
            })),
            created_at: role.created_at,
            updated_at: role.updated_at
        }));
    }

    async findRoleById(id: string): Promise<RoleResponseDto | null> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions'],
        });
        if (!role) return null;

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions.map(permission => ({
                id: permission.id,
                name: permission.name,
                resource: permission.resource,
                action: permission.action
            })),
            created_at: role.created_at,
            updated_at: role.updated_at
        };
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
        const role = this.roleRepository.create(createRoleDto);
        const savedRole = await this.roleRepository.save(role);
        
        return {
            id: savedRole.id,
            name: savedRole.name,
            description: savedRole.description,
            permissions: [],
            created_at: savedRole.created_at,
            updated_at: savedRole.updated_at
        };
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({ 
            where: { id },
            relations: ['permissions']
        });

        if (!role) {
            throw new HttpException(404, '角色不存在');
        }

        Object.assign(role, updateRoleDto);
        const savedRole = await this.roleRepository.save(role);
        
        return {
            id: savedRole.id,
            name: savedRole.name,
            description: savedRole.description,
            permissions: savedRole.permissions.map(p => ({
                id: p.id,
                name: p.name,
                resource: p.resource,
                action: p.action
            })),
            created_at: savedRole.created_at,
            updated_at: savedRole.updated_at
        };
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepository.delete(id);
    }

    async assignPermissionsToRole(roleId: string, data: AssignPermissionsDto): Promise<RoleResponseDto | null> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        if (!role) return null;

        const permissions = await this.permissionRepository.findBy({
            id: In(data.permissions)
        });
        role.permissions = permissions;

        const savedRole = await this.roleRepository.save(role);
        return {
            id: savedRole.id,
            name: savedRole.name,
            description: savedRole.description,
            permissions: savedRole.permissions.map(permission => ({
                id: permission.id,
                name: permission.name,
                resource: permission.resource,
                action: permission.action
            })),
            created_at: savedRole.created_at,
            updated_at: savedRole.updated_at
        };
    }

    async assignRolesToUser(userId: string, data: AssignRolesDto): Promise<UserRolesResponseDto> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions'],
        });
        
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        const roles = await this.roleRepository.findBy({
            id: In(data.roles)
        });
        user.roles = roles;

        const savedUser = await this.userRepository.save(user);
        return {
            id: savedUser.id,
            username: savedUser.username,
            roles: savedUser.roles.map(r => ({
                id: r.id,
                name: r.name,
                permissions: r.permissions.map(p => ({
                    id: p.id,
                    name: p.name,
                    resource: p.resource,
                    action: p.action
                }))
            })),
            updated_at: savedUser.updated_at
        };
    }

    async getUserPermissions(userId: string): Promise<PermissionResponseDto[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions'],
        });

        if (!user) return [];

        const permissions = new Set<Permission>();
        user.roles.forEach(role => {
            role.permissions.forEach(permission => {
                permissions.add(permission);
            });
        });

        return Array.from(permissions).map(permission => ({
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            created_at: permission.created_at,
            updated_at: permission.updated_at
        }));
    }
} 