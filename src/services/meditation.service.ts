import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { MeditationMaterial, MeditationRecord, MeditationStatus } from '@/models/meditation.model';
import { GetMaterialsQueryDto, GetRecordsQueryDto, StartMeditationDto, EndMeditationDto } from '@/dtos/meditation.dto';
import { HttpException } from '@/exceptions/http.exception';
import { MeditationMaterialDto, MeditationRecordDto } from '@/dtos/meditation.dto';
import { CreateMaterialDto, UpdateMaterialDto } from '@/dtos/meditation.dto';
import { Asset } from '@/models/asset.model';

export class MeditationService {
  private materialRepository: Repository<MeditationMaterial>;
  private recordRepository: Repository<MeditationRecord>;
  private assetRepository: Repository<Asset>;

  constructor() {
    this.materialRepository = AppDataSource.getRepository(MeditationMaterial);
    this.recordRepository = AppDataSource.getRepository(MeditationRecord);
    this.assetRepository = AppDataSource.getRepository(Asset);
  }

  // 获取冥想素材列表
  async getMaterials(query: GetMaterialsQueryDto) {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.materialRepository.createQueryBuilder('material');

    if (type) {
      queryBuilder.where('material.type = :type', { type });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('material.created_at', 'DESC')
      .getManyAndCount();

    return {
      total,
      items,
    };
  }

  // 获取单个冥想素材
  async getMaterialById(id: string) {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['asset']
    });

    if (!material) {
      throw new HttpException(404, '冥想素材不存在');
    }

    return material;
  }

  // 创建冥想素材
  async createMaterial(dto: CreateMaterialDto) {
    // 如果提供了assetId，验证资源是否存在
    if (dto.assetId) {
      const asset = await this.assetRepository.findOne({
        where: { id: dto.assetId }
      });
      
      if (!asset) {
        throw new HttpException(404, '指定的资源不存在');
      }
    }
    
    const material = this.materialRepository.create({
      title: dto.title,
      description: dto.description || null,
      type: dto.type,
      assetId: dto.assetId || null,
      content: dto.content || null,
      duration: dto.duration || null
    });

    await this.materialRepository.save(material);
    return this.getMaterialById(material.id);
  }

  // 更新冥想素材
  async updateMaterial(id: string, dto: UpdateMaterialDto) {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['asset']
    });

    if (!material) {
      throw new HttpException(404, '冥想素材不存在');
    }

    // 如果提供了assetId，验证资源是否存在
    if (dto.assetId) {
      const asset = await this.assetRepository.findOne({
        where: { id: dto.assetId }
      });
      
      if (!asset) {
        throw new HttpException(404, '指定的资源不存在');
      }
    }

    // 更新字段
    if (dto.title) material.title = dto.title;
    if (dto.description !== undefined) material.description = dto.description;
    if (dto.type) material.type = dto.type;
    if (dto.assetId !== undefined) material.assetId = dto.assetId;
    if (dto.content !== undefined) material.content = dto.content;
    if (dto.duration !== undefined) material.duration = dto.duration;

    await this.materialRepository.save(material);
    return this.getMaterialById(material.id);
  }

  // 删除冥想素材
  async deleteMaterial(id: string) {
    const material = await this.materialRepository.findOne({
      where: { id }
    });

    if (!material) {
      throw new HttpException(404, '冥想素材不存在');
    }

    // 检查素材是否被使用
    const records = await this.recordRepository.find();
    const isUsed = records.some(record => 
      record.materials.includes(id)
    );

    if (isUsed) {
      throw new HttpException(400, '该素材已被冥想记录使用，无法删除');
    }

    await this.materialRepository.remove(material);
    return { success: true };
  }

  // 开始冥想
  async startMeditation(userId: string, dto: StartMeditationDto) {
    // 检查是否有进行中的冥想
    const ongoingMeditation = await this.recordRepository.findOne({
      where: {
        userId,
        status: 'start' as MeditationStatus,
      },
    });

    if (ongoingMeditation) {
      throw new HttpException(400, '您有一个正在进行的冥想，请先结束当前冥想');
    }

    // 检查素材是否存在
    const material = await this.materialRepository.findOne({
      where: { id: dto.materialId },
      relations: ['asset']
    });

    if (!material) {
      throw new HttpException(404, '冥想素材不存在');
    }

    // 创建冥想记录
    const record = this.recordRepository.create({
      userId,
      materials: [dto.materialId],
      status: 'start' as MeditationStatus,
      startTime: new Date(),
      duration: dto.duration
    });

    await this.recordRepository.save(record);

    return {
      id: record.id,
      userId: record.userId,
      status: record.status,
      startTime: record.startTime,
      endTime: null,
      duration: record.duration,
      materials: [{
        id: material.id,
        title: material.title,
        type: material.type,
        assetId: material.assetId,
        asset: material.asset ? {
          id: material.asset.id,
          path: material.asset.path,
          mimetype: material.asset.mimetype
        } : null,
        content: material.content,
      }],
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  }

  // 结束冥想
  async endMeditation(userId: string, dto: EndMeditationDto) {
    const record = await this.recordRepository.findOne({
      where: {
        id: dto.meditationId,
        userId,
      },
    });

    if (!record) {
      throw new HttpException(404, '冥想记录不存在');
    }

    if (record.status !== 'start') {
      throw new HttpException(400, '该冥想已经结束');
    }

    record.status = 'completed' as MeditationStatus;
    record.endTime = new Date();
    record.duration = dto.actualDuration;

    await this.recordRepository.save(record);

    // 获取相关的素材信息
    const materials = await this.materialRepository.findByIds(record.materials);

    return {
      id: record.id,
      userId: record.userId,
      status: record.status,
      startTime: record.startTime,
      endTime: record.endTime,
      duration: record.duration,
      materials: materials.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        assetId: m.assetId,
        asset: m.asset ? {
          id: m.asset.id,
          path: m.asset.path,
          mimetype: m.asset.mimetype
        } : null,
        content: m.content,
      })),
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  }

  // 获取冥想记录
  async getRecords(userId: string, query: GetRecordsQueryDto) {
    const { page = 1, limit = 10, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('record.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('record.startTime >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('record.startTime <= :endDate', { endDate });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('record.created_at', 'DESC')
      .getManyAndCount();

    // 获取相关的素材信息
    const records = await Promise.all(
      items.map(async record => {
        const materials = await this.materialRepository.findByIds(record.materials);
        return {
          id: record.id,
          userId: record.userId,
          status: record.status,
          startTime: record.startTime,
          endTime: record.endTime,
          duration: record.duration,
          materials: materials.map(m => ({
            id: m.id,
            title: m.title,
            type: m.type,
            assetId: m.assetId,
            asset: m.asset ? {
              id: m.asset.id,
              path: m.asset.path,
              mimetype: m.asset.mimetype
            } : null,
            content: m.content,
          })),
          created_at: record.created_at,
          updated_at: record.updated_at
        };
      })
    );

    return {
      total,
      items: records,
    };
  }

  // 获取进行中的冥想
  async getOngoingMeditation(userId: string) {
    const record = await this.recordRepository.findOne({
      where: {
        userId,
        status: 'start' as MeditationStatus,
      },
    });

    if (!record) {
      return null;
    }

    const materials = await this.materialRepository.findByIds(record.materials);

    return {
      id: record.id,
      userId: record.userId,
      status: record.status,
      startTime: record.startTime,
      endTime: null,
      duration: null,
      materials: materials.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        assetId: m.assetId,
        asset: m.asset ? {
          id: m.asset.id,
          path: m.asset.path,
          mimetype: m.asset.mimetype
        } : null,
        content: m.content,
      })),
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  }

  // 转换素材为 DTO
  private toMaterialDto(material: any): MeditationMaterialDto {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      type: material.type,
      assetId: material.assetId,
      asset: material.asset ? {
        id: material.asset.id,
        path: material.asset.path,
        mimetype: material.asset.mimetype
      } : null,
      content: material.content,
      duration: material.duration,
      created_at: material.created_at,
      updated_at: material.updated_at
    };
  }

  // 转换记录为 DTO
  private toRecordDto(record: any): MeditationRecordDto {
    return {
      id: record.id,
      userId: record.userId,
      status: record.status,
      startTime: record.startTime,
      endTime: record.endTime,
      duration: record.duration,
      materials: record.materials.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        assetId: m.assetId,
        asset: m.asset ? {
          id: m.asset.id,
          path: m.asset.path,
          mimetype: m.asset.mimetype
        } : null,
        content: m.content
      })),
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  }
} 