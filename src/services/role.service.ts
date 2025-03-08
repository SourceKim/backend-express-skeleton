import { In, Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { Permission } from '@/models/permission.model';
import { Role } from '@/models/role.model';
import { User } from '@/models/user.model';
import {
    CreateRoleDto,
    UpdateRoleDto,
    AssignPermissionsDto,
    AssignRolesDto,
    RoleResponseDto,
    UserRolesResponseDto
} from '@/dtos/role.dto';
import { HttpException } from '@/exceptions/http.exception';

export class RoleService {
    private permissionRepository: Repository<Permission>;
    private roleRepository: Repository<Role>;
    private userRepository: Repository<User>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
        this.roleRepository = AppDataSource.getRepository(Role);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.roleRepository.find({
            relations: ['permissions']
        });

        return roles.map(role => ({
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
        }));
    }

    async findRoleById(id: string): Promise<RoleResponseDto | null> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
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
        const role = this.roleRepository.create({
            ...createRoleDto,
            permissions: []
        });

        await this.roleRepository.save(role);

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: [],
            created_at: role.created_at,
            updated_at: role.updated_at
        };
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto | null> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });

        if (!role) return null;

        // 更新角色属性
        if (updateRoleDto.name) role.name = updateRoleDto.name;
        if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;

        await this.roleRepository.save(role);

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

    async deleteRole(id: string): Promise<void> {
        await this.roleRepository.delete(id);
    }

    async assignPermissionsToRole(roleId: string, data: AssignPermissionsDto): Promise<RoleResponseDto | null> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId }
        });

        if (!role) return null;

        // 获取权限
        const permissions = await this.permissionRepository.find({
            where: { id: In(data.permissions) }
        });

        // 更新角色权限
        role.permissions = permissions;
        await this.roleRepository.save(role);

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: permissions.map(permission => ({
                id: permission.id,
                name: permission.name,
                resource: permission.resource,
                action: permission.action
            })),
            created_at: role.created_at,
            updated_at: role.updated_at
        };
    }

    async assignRolesToUser(userId: string, data: AssignRolesDto): Promise<UserRolesResponseDto> {
        // 获取用户
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 获取角色
        const roles = await this.roleRepository.find({
            where: { id: In(data.roles) },
            relations: ['permissions']
        });

        // 更新用户角色
        user.roles = roles;
        await this.userRepository.save(user);

        return {
            id: user.id,
            username: user.username,
            roles: user.roles.map(role => ({
                id: role.id,
                name: role.name,
                permissions: role.permissions.map(permission => ({
                    id: permission.id,
                    name: permission.name,
                    resource: permission.resource,
                    action: permission.action
                }))
            })),
            updated_at: user.updated_at
        };
    }
} 