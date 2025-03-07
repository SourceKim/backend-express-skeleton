import { AppDataSource } from '../src/config/database';
import { MeditationMaterial } from '../src/models/meditation.model';

const meditationMaterials = [
  {
    title: '初学者引导冥想',
    description: '适合冥想初学者的引导音频，帮助你进入正确的冥想状态',
    type: 'audio' as const,
    url: 'https://storage.askbudda.com/meditations/beginner-guide.mp3',
    duration: 10
  },
  {
    title: '正念呼吸练习',
    description: '专注于呼吸的引导冥想，帮助你培养正念觉察',
    type: 'audio' as const,
    url: 'https://storage.askbudda.com/meditations/mindful-breathing.mp3',
    duration: 15
  },
  {
    title: '慈心冥想',
    description: '通过培养慈悲心，向自己和他人散发善意的冥想练习',
    type: 'audio' as const,
    url: 'https://storage.askbudda.com/meditations/loving-kindness.mp3',
    duration: 20
  },
  {
    title: '大自然白噪音',
    description: '舒缓的自然环境音，包含森林、溪流和鸟鸣声',
    type: 'audio' as const,
    url: 'https://storage.askbudda.com/meditations/nature-sounds.mp3',
    duration: 30
  },
  {
    title: '行禅引导',
    description: '一步一步的行禅引导，帮助你在行走中保持正念',
    type: 'text' as const,
    content: `1. 选择一个安静的地方，可以是室内或户外
2. 站立时，感受双脚与地面的接触
3. 开始缓慢移动，每一步都要觉察
4. 注意提起、移动、放下每个动作
5. 保持呼吸的觉知
6. 如果心散了，温和地把注意力带回到步伐上
7. 每次行禅建议15-20分钟`,
    duration: 15
  },
  {
    title: '基础禅修曼陀罗',
    description: '简单而优雅的曼陀罗图案，适合初学者专注观想',
    type: 'image' as const,
    url: 'https://storage.askbudda.com/meditations/basic-mandala.jpg',
    duration: 10
  },
  {
    title: '莲花曼陀罗',
    description: '以莲花为主题的曼陀罗图案，象征纯净与觉醒',
    type: 'image' as const,
    url: 'https://storage.askbudda.com/meditations/lotus-mandala.jpg',
    duration: 15
  },
  {
    title: '宇宙曼陀罗',
    description: '展现宇宙能量流动的曼陀罗图案，帮助深层冥想',
    type: 'image' as const,
    url: 'https://storage.askbudda.com/meditations/cosmic-mandala.jpg',
    duration: 20
  },
  {
    title: '五行曼陀罗',
    description: '融合金木水火土五行元素的曼陀罗图案',
    type: 'image' as const,
    url: 'https://storage.askbudda.com/meditations/elements-mandala.jpg',
    duration: 15
  },
  {
    title: '佛陀观想图',
    description: '庄严的佛陀坐像，用于修习佛陀相应法门',
    type: 'image' as const,
    url: 'https://storage.askbudda.com/meditations/buddha-visualization.jpg',
    duration: 20
  }
];

async function seedMeditationMaterials() {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    console.log('数据库连接成功');

    // 创建素材
    const materialRepository = AppDataSource.getRepository(MeditationMaterial);
    
    for (const material of meditationMaterials) {
      const existingMaterial = await materialRepository.findOne({
        where: { title: material.title }
      });

      if (!existingMaterial) {
        await materialRepository.save(material);
        console.log(`创建冥想素材: ${material.title}`);
      } else {
        console.log(`素材已存在: ${material.title}`);
      }
    }

    console.log('冥想素材添加完成');
    process.exit(0);
  } catch (error) {
    console.error('添加冥想素材失败:', error);
    process.exit(1);
  }
}

// 运行脚本
seedMeditationMaterials(); 