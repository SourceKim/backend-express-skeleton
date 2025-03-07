import { AppDataSource } from '../src/config/database';
import { Sutra } from '../src/models/sutra.model';

// 示例佛经数据
const sutraData = [
    {
        title: '金刚经',
        category: '般若部',
        description: '《金刚经》全名为《金刚般若波罗蜜经》，是佛教最重要的经典之一',
        content: '如是我闻：一时佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。尔时，世尊食时，著衣持钵，入舍卫大城乞食...',
        read_count: 0
    },
    {
        title: '心经',
        category: '般若部',
        description: '《般若波罗蜜多心经》是般若部中篇幅最短但内容最精辟的经典',
        content: '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。舍利子，色不异空，空不异色，色即是空，空即是色...',
        read_count: 0
    },
    {
        title: '法华经',
        category: '法华部',
        description: '《妙法莲华经》是天台宗的根本经典',
        content: '如是我闻：一时，佛住王舍城耆阇崛山中，与大比丘众万二千人俱，皆是阿罗汉...',
        read_count: 0
    },
    {
        title: '楞严经',
        category: '方等部',
        description: '《大佛顶首楞严经》是禅宗重要经典之一',
        content: '如是我闻：一时，佛在室罗筏城祇桓精舍，与大比丘众千二百五十人俱，皆是无漏大阿罗汉...',
        read_count: 0
    },
    {
        title: '六祖坛经',
        category: '禅宗',
        description: '《六祖坛经》是中国禅宗的重要经典',
        content: '时，大师至宝林，韶州韦刺史名璩，与官僚入山请师，出于城中大梵寺讲堂，为众开缘说法...',
        read_count: 0
    }
];

async function seedSutras() {
    try {
        // 初始化数据库连接
        await AppDataSource.initialize();
        
        console.log('开始导入佛经数据...');
        
        // 清空现有数据
        await AppDataSource.getRepository(Sutra).clear();
        
        // 插入新数据
        for (const data of sutraData) {
            const sutra = new Sutra();
            Object.assign(sutra, data);
            await AppDataSource.getRepository(Sutra).save(sutra);
            console.log(`已导入: ${data.title}`);
        }
        
        console.log('佛经数据导入完成！');
        
    } catch (error) {
        console.error('数据导入失败:', error);
    } finally {
        // 关闭数据库连接
        await AppDataSource.destroy();
    }
}

// 运行导入脚本
seedSutras(); 