import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { UserSettings } from '@/models/user-settings.model';
import { User } from '@/models/user.model';
import {
    CreateUserSettingsDto,
    UpdateUserSettingsDto,
    UserSettingsResponseDto
} from '@/dtos/user-settings.dto';
import { HttpException } from '@/exceptions/http.exception';

export class UserSettingsService {
    private userSettingsRepository: Repository<UserSettings>;
    private userRepository: Repository<User>;

    constructor() {
        this.userSettingsRepository = AppDataSource.getRepository(UserSettings);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getUserSettings(userId: string): Promise<UserSettingsResponseDto | null> {
        const settings = await this.userSettingsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (!settings) return null;

        return {
            id: settings.id,
            theme: settings.theme,
            language: settings.language,
            notifications_enabled: settings.notifications_enabled,
            created_at: settings.created_at,
            updated_at: settings.updated_at
        };
    }

    async createUserSettings(userId: string, createUserSettingsDto: CreateUserSettingsDto): Promise<UserSettingsResponseDto> {
        // 检查用户是否存在
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 检查用户是否已有设置
        const existingSettings = await this.userSettingsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (existingSettings) {
            throw new HttpException(400, '用户设置已存在');
        }

        // 创建新的用户设置
        const newSettings = this.userSettingsRepository.create({
            ...createUserSettingsDto,
            user
        });

        // 保存设置并确保返回的是单个对象而不是数组
        const savedSettings = await this.userSettingsRepository.save(newSettings) as UserSettings;

        return {
            id: savedSettings.id,
            theme: savedSettings.theme,
            language: savedSettings.language,
            notifications_enabled: savedSettings.notifications_enabled,
            created_at: savedSettings.created_at,
            updated_at: savedSettings.updated_at
        };
    }

    async updateUserSettings(userId: string, updateUserSettingsDto: UpdateUserSettingsDto): Promise<UserSettingsResponseDto | null> {
        // 检查用户设置是否存在
        const settings = await this.userSettingsRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });

        if (!settings) return null;

        // 更新设置
        if (updateUserSettingsDto.theme !== undefined) settings.theme = updateUserSettingsDto.theme;
        if (updateUserSettingsDto.language !== undefined) settings.language = updateUserSettingsDto.language;
        if (updateUserSettingsDto.notifications_enabled !== undefined) 
            settings.notifications_enabled = updateUserSettingsDto.notifications_enabled;

        // 保存设置并确保返回的是单个对象而不是数组
        const updatedSettings = await this.userSettingsRepository.save(settings) as UserSettings;

        return {
            id: updatedSettings.id,
            theme: updatedSettings.theme,
            language: updatedSettings.language,
            notifications_enabled: updatedSettings.notifications_enabled,
            created_at: updatedSettings.created_at,
            updated_at: updatedSettings.updated_at
        };
    }

    async deleteUserSettings(userId: string): Promise<void> {
        const settings = await this.userSettingsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (settings) {
            await this.userSettingsRepository.remove(settings);
        }
    }
} 