import { AppDataSource } from '../src/config/database';
import { WorshipMaterial } from '../src/models/worship.model';
import { Asset } from '../src/models/asset.model';

async function seedWorshipMaterials() {
    try {
        // 初始化数据库连接
        await AppDataSource.initialize();
        console.log('数据库连接成功');

        // 首先创建各种资源
        const assetRepository = AppDataSource.getRepository(Asset);
        const materialRepository = AppDataSource.getRepository(WorshipMaterial);
        
        // 创建资源
        const assets = [
            // 佛像资源
            {
                filename: 'shakyamuni.jpg',
                originalname: '释迦牟尼佛.jpg',
                path: 'https://storage.askbudda.com/worship/buddha/shakyamuni.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '释迦牟尼佛图片',
                isPublic: true,
                upload_dir: '/worship/buddha'
            },
            {
                filename: 'guanyin.jpg',
                originalname: '观世音菩萨.jpg',
                path: 'https://storage.askbudda.com/worship/buddha/guanyin.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '观世音菩萨图片',
                isPublic: true,
                upload_dir: '/worship/buddha'
            },
            {
                filename: 'dizang.jpg',
                originalname: '地藏王菩萨.jpg',
                path: 'https://storage.askbudda.com/worship/buddha/dizang.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '地藏王菩萨图片',
                isPublic: true,
                upload_dir: '/worship/buddha'
            },
            // 香炉资源
            {
                filename: 'copper.jpg',
                originalname: '古典铜香炉.jpg',
                path: 'https://storage.askbudda.com/worship/incense-burner/copper.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '古典铜香炉图片',
                isPublic: true,
                upload_dir: '/worship/incense-burner'
            },
            {
                filename: 'lotus.jpg',
                originalname: '莲花香炉.jpg',
                path: 'https://storage.askbudda.com/worship/incense-burner/lotus.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '莲花香炉图片',
                isPublic: true,
                upload_dir: '/worship/incense-burner'
            },
            // 香资源
            {
                filename: 'sandalwood.jpg',
                originalname: '檀香.jpg',
                path: 'https://storage.askbudda.com/worship/incense/sandalwood.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '檀香图片',
                isPublic: true,
                upload_dir: '/worship/incense'
            },
            {
                filename: 'agarwood.jpg',
                originalname: '沉香.jpg',
                path: 'https://storage.askbudda.com/worship/incense/agarwood.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                type: 'image' as const,
                category: 'worship',
                description: '沉香图片',
                isPublic: true,
                upload_dir: '/worship/incense'
            },
            // 音频资源
            {
                filename: 'temple-bells.mp3',
                originalname: '晨钟暮鼓.mp3',
                path: 'https://storage.askbudda.com/worship/audio/temple-bells.mp3',
                mimetype: 'audio/mpeg',
                size: 2048,
                type: 'audio' as const,
                category: 'worship',
                description: '寺院清晨和傍晚的钟鼓声',
                isPublic: true,
                upload_dir: '/worship/audio'
            },
            {
                filename: 'chanting.mp3',
                originalname: '梵音唱诵.mp3',
                path: 'https://storage.askbudda.com/worship/audio/chanting.mp3',
                mimetype: 'audio/mpeg',
                size: 2048,
                type: 'audio' as const,
                category: 'worship',
                description: '庄严的佛教音乐',
                isPublic: true,
                upload_dir: '/worship/audio'
            },
            // 文本资源
            {
                filename: 'incense-etiquette.txt',
                originalname: '上香礼仪.txt',
                path: 'https://storage.askbudda.com/worship/text/incense-etiquette.txt',
                mimetype: 'text/plain',
                size: 512,
                type: 'document' as const,
                category: 'worship',
                description: '正确的上香方式和注意事项',
                isPublic: true,
                upload_dir: '/worship/text'
            },
            {
                filename: 'prayer.txt',
                originalname: '上香祈愿文.txt',
                path: 'https://storage.askbudda.com/worship/text/prayer.txt',
                mimetype: 'text/plain',
                size: 512,
                type: 'document' as const,
                category: 'worship',
                description: '上香时可以诵读的祈愿文',
                isPublic: true,
                upload_dir: '/worship/text'
            }
        ];

        const savedAssets = {};
        
        for (const asset of assets) {
            const existingAsset = await assetRepository.findOne({
                where: { path: asset.path }
            });
            
            if (existingAsset) {
                savedAssets[asset.path] = existingAsset;
                console.log(`资源已存在: ${asset.originalname}`);
            } else {
                const newAsset = await assetRepository.save(asset);
                savedAssets[asset.path] = newAsset;
                console.log(`创建资源: ${asset.originalname}`);
            }
        }
        
        // 上香素材数据
        const worshipMaterials = [
            // 佛像
            {
                title: '释迦牟尼佛',
                description: '释迦牟尼佛是佛教的创始人，代表着智慧和慈悲',
                type: 'buddha' as const,
                assetPath: 'https://storage.askbudda.com/worship/buddha/shakyamuni.jpg'
            },
            {
                title: '观世音菩萨',
                description: '观世音菩萨代表着大慈大悲，救苦救难',
                type: 'buddha' as const,
                assetPath: 'https://storage.askbudda.com/worship/buddha/guanyin.jpg'
            },
            {
                title: '地藏王菩萨',
                description: '地藏王菩萨以"地狱不空，誓不成佛"的大愿闻名',
                type: 'buddha' as const,
                assetPath: 'https://storage.askbudda.com/worship/buddha/dizang.jpg'
            },

            // 香炉
            {
                title: '古典铜香炉',
                description: '传统的铜制香炉，庄严肃穆',
                type: 'incense_burner' as const,
                assetPath: 'https://storage.askbudda.com/worship/incense-burner/copper.jpg'
            },
            {
                title: '莲花香炉',
                description: '莲花造型的香炉，象征着清净',
                type: 'incense_burner' as const,
                assetPath: 'https://storage.askbudda.com/worship/incense-burner/lotus.jpg'
            },

            // 香
            {
                title: '檀香',
                description: '传统的檀香，清香淡雅',
                type: 'incense' as const,
                assetPath: 'https://storage.askbudda.com/worship/incense/sandalwood.jpg'
            },
            {
                title: '沉香',
                description: '珍贵的沉香，香气持久',
                type: 'incense' as const,
                assetPath: 'https://storage.askbudda.com/worship/incense/agarwood.jpg'
            }
        ];

        // 创建素材
        for (const material of worshipMaterials) {
            const asset = savedAssets[material.assetPath];
            if (!asset) {
                console.log(`找不到资源: ${material.assetPath}`);
                continue;
            }

            const existingMaterial = await materialRepository.findOne({
                where: { title: material.title }
            });

            if (!existingMaterial) {
                const newMaterial = materialRepository.create({
                    title: material.title,
                    description: material.description,
                    type: material.type,
                    assetId: asset.id
                });
                await materialRepository.save(newMaterial);
                console.log(`创建上香素材: ${material.title}`);
            } else {
                console.log(`素材已存在: ${material.title}`);
            }
        }

        console.log('上香素材添加完成');
        process.exit(0);
    } catch (error) {
        console.error('添加上香素材失败:', error);
        process.exit(1);
    }
}

// 运行脚本
seedWorshipMaterials(); 