import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Progress, Tag, Divider, Empty, Badge } from 'antd';
import { DownloadOutlined, CheckOutlined, StarFilled } from '@ant-design/icons';
import './OfflineWordPacks.css'; // Assume we have a corresponding CSS file

type WordPack = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  wordCount: number;
  size: string;
  lastUpdated: string;
  tags: string[];
  featured: boolean;
  downloadCount: number;
  rating: number;
};

const wordPacks: WordPack[] = [
  // ... (existing word packs data remains the same)
];

const OfflineWordPacks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'alphabetical'>('popular');
  const [downloadedPacks, setDownloadedPacks] = useState<number[]>([]);
  const [downloadingPacks, setDownloadingPacks] = useState<number[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<Record<number, number>>({});

  // Get unique categories and difficulties
  const categories = ['All', ...new Set(wordPacks.map(pack => pack.category))];
  const difficulties = ['All', ...new Set(wordPacks.map(pack => pack.difficulty))];

  // Filter and sort packs
  const filteredPacks = wordPacks
    .filter(pack => {
      const matchesCategory = selectedCategory === 'All' || pack.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || pack.difficulty === selectedDifficulty;
      const matchesSearch = searchTerm === '' || 
        pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesDifficulty && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Simulate download process
  const handleDownload = (packId: number) => {
    if (downloadedPacks.includes(packId)) return;

    setDownloadingPacks(prev => [...prev, packId]);
    setDownloadProgress(prev => ({ ...prev, [packId]: 0 }));

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        newProgress[packId] = Math.min(newProgress[packId] + 10, 100);
        
        if (newProgress[packId] === 100) {
          clearInterval(interval);
          setDownloadingPacks(prev => prev.filter(id => id !== packId));
          setDownloadedPacks(prev => [...prev, packId]);
        }
        
        return newProgress;
      });
    }, 300);
  };

  const renderPackCard = (pack: WordPack) => {
    const isDownloaded = downloadedPacks.includes(pack.id);
    const isDownloading = downloadingPacks.includes(pack.id);
    const progress = downloadProgress[pack.id] || 0;

    return (
      <Card
        key={pack.id}
        className={`word-pack-card ${pack.featured ? 'featured' : ''}`}
        title={
          <div className="pack-title">
            {pack.title}
            {pack.featured && <Tag color="gold" className="featured-tag">Featured</Tag>}
          </div>
        }
        extra={
          <div className="pack-meta">
            <span className="download-count">
              <DownloadOutlined /> {pack.downloadCount.toLocaleString()}
            </span>
            <span className="rating">
              <StarFilled /> {pack.rating}
            </span>
          </div>
        }
      >
        <div className="pack-content">
          <p className="pack-description">{pack.description}</p>
          
          <div className="pack-tags">
            {pack.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          
          <div className="pack-details">
            <span>Category: {pack.category}</span>
            <span>Difficulty: {pack.difficulty}</span>
            <span>Words: {pack.wordCount}</span>
            <span>Size: {pack.size}</span>
          </div>
          
          {isDownloading ? (
            <Progress percent={progress} status="active" />
          ) : (
            <Button
              type="primary"
              icon={isDownloaded ? <CheckOutlined /> : <DownloadOutlined />}
              onClick={() => !isDownloaded && handleDownload(pack.id)}
              disabled={isDownloaded}
              block
            >
              {isDownloaded ? 'Downloaded' : 'Download'}
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="offline-word-packs-container">
      <div className="filters-section">
        <Input.Search
          placeholder="Search word packs..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        
        <div className="filter-controls">
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 180 }}
          >
            {categories.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
          
          <Select
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            style={{ width: 180 }}
          >
            {difficulties.map(difficulty => (
              <Select.Option key={difficulty} value={difficulty}>
                {difficulty}
              </Select.Option>
            ))}
          </Select>
          
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 180 }}
          >
            <Select.Option value="popular">Most Popular</Select.Option>
            <Select.Option value="rating">Highest Rated</Select.Option>
            <Select.Option value="newest">Newest</Select.Option>
            <Select.Option value="alphabetical">A-Z</Select.Option>
          </Select>
        </div>
      </div>
      
      <Divider />
      
      <div className="word-packs-grid">
        {filteredPacks.length > 0 ? (
          filteredPacks.map(renderPackCard)
        ) : (
          <Empty description="No word packs found matching your criteria" />
        )}
      </div>
    </div>
  );
};

export default OfflineWordPacks;