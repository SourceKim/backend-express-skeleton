import { AppDataSource } from '@/config/database';
import { Sutra } from '@/models/sutra.model';
import { Repository } from 'typeorm';
import { HttpException } from '@/exceptions/http.exception';

export class SutraService {
    private sutraRepository: Repository<Sutra>;

    constructor() {
        this.sutraRepository = AppDataSource.getRepository(Sutra);
    }

    /**
     * 获取佛经列表
     * @param page 页码
     * @param limit 每页条数
     * @param category 分类
     * @param keyword 搜索关键词
     */
    public async getSutras(page = 1, limit = 20, category?: string, keyword?: string) {
        const queryBuilder = this.sutraRepository.createQueryBuilder('sutra');

        if (category) {
            queryBuilder.andWhere('sutra.category = :category', { category });
        }

        if (keyword) {
            queryBuilder.andWhere('(sutra.title LIKE :keyword OR sutra.description LIKE :keyword)', 
                { keyword: `%${keyword}%` });
        }

        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { items, total };
    }

    /**
     * 获取佛经详情
     * @param id 佛经ID
     */
    public async getSutraById(id: string): Promise<Sutra> {
        const sutra = await this.sutraRepository.findOneBy({ id });
        if (!sutra) {
            throw new HttpException(404, '佛经不存在');
        }
        return sutra;
    }

    /**
     * 创建佛经
     * @param sutraData 佛经数据
     */
    public async createSutra(sutraData: Partial<Sutra>): Promise<Sutra> {
        const sutra = this.sutraRepository.create(sutraData);
        return await this.sutraRepository.save(sutra);
    }

    /**
     * 更新佛经
     * @param id 佛经ID
     * @param sutraData 更新的数据
     */
    public async updateSutra(id: string, sutraData: Partial<Sutra>): Promise<Sutra> {
        const sutra = await this.getSutraById(id);
        Object.assign(sutra, sutraData);
        return await this.sutraRepository.save(sutra);
    }

    /**
     * 删除佛经
     * @param id 佛经ID
     */
    public async deleteSutra(id: string): Promise<void> {
        const sutra = await this.getSutraById(id);
        await this.sutraRepository.remove(sutra);
    }

    /**
     * 增加阅读次数
     * @param id 佛经ID
     */
    public async incrementReadCount(id: string): Promise<Sutra> {
        const sutra = await this.getSutraById(id);
        sutra.read_count += 1;
        return await this.sutraRepository.save(sutra);
    }
} 