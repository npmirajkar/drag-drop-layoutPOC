import React, { useState, useCallback } from 'react';
import { Grid, styled } from '@mui/material';
import { useDragLayer } from 'react-dnd';
import ImagePack from '../molecules/ImagePack';
import LayoutSection from '../organisms/LayoutSection';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

const CustomDragLayer = styled('div')({
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
});

interface Image {
  id: string;
  src: string;
  left: number;
  top: number;
}

const DragLayerComponent: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <CustomDragLayer>
      <div style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}>
        <img src={item.src} alt="Dragged item" style={{ width: 100, height: 100, opacity: 0.8 }} />
      </div>
    </CustomDragLayer>
  );
};

const DragDropLayout: React.FC = () => {
  const [imagePacks, setImagePacks] = useState<Array<{ title: string; images: Image[] }>>([
    { 
      title: 'Pack 1', 
      images: [
        { id: '1', src: 'https://via.placeholder.com/100?text=1', left: 10, top: 10 },
        { id: '2', src: 'https://via.placeholder.com/100?text=2', left: 120, top: 10 },
      ]
    },
    { 
      title: 'Pack 2', 
      images: [
        { id: '3', src: 'https://via.placeholder.com/100?text=3', left: 10, top: 10 },
        { id: '4', src: 'https://via.placeholder.com/100?text=4', left: 120, top: 10 },
      ]
    },
  ]);

  const [layoutSections, setLayoutSections] = useState<Array<{ title: string; allowDrop: boolean; images: Image[] }>>([
    { title: 'Header', allowDrop: false, images: [] },
    { title: 'Content 1', allowDrop: true, images: [] },
    { title: 'Content 2', allowDrop: true, images: [] },
  ]);

  const handleDrop = useCallback((targetType: 'pack' | 'section', targetIndex: number, id: string, left: number, top: number) => {
    let sourceType: 'pack' | 'section' | null = null;
    let sourceIndex = -1;
    let image: Image | null = null;

    // Find the image and its source
    imagePacks.forEach((pack, index) => {
      const foundImage = pack.images.find(img => img.id === id);
      if (foundImage) {
        sourceType = 'pack';
        sourceIndex = index;
        image = foundImage;
      }
    });

    if (!image) {
      layoutSections.forEach((section, index) => {
        const foundImage = section.images.find(img => img.id === id);
        if (foundImage) {
          sourceType = 'section';
          sourceIndex = index;
          image = foundImage;
        }
      });
    }

    if (image) {
      // Remove image from source
      if (sourceType === 'pack') {
        setImagePacks(packs => 
          packs.map((pack, index) => 
            index === sourceIndex 
              ? { ...pack, images: pack.images.filter(img => img.id !== id) }
              : pack
          )
        );
      } else if (sourceType === 'section') {
        setLayoutSections(sections => 
          sections.map((section, index) => 
            index === sourceIndex 
              ? { ...section, images: section.images.filter(img => img.id !== id) }
              : section
          )
        );
      }

      // Add image to target
      if (targetType === 'pack') {
        setImagePacks(packs => 
          packs.map((pack, index) => 
            index === targetIndex 
              ? { ...pack, images: [...pack.images, { ...image!, left, top }] }
              : pack
          )
        );
      } else {
        setLayoutSections(sections => 
          sections.map((section, index) => 
            index === targetIndex 
              ? { ...section, images: [...section.images, { ...image!, left, top }] }
              : section
          )
        );
      }
    }
  }, [imagePacks, layoutSections]);

  return (
    <Container>
      <DragLayerComponent />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {imagePacks.map((pack, index) => (
            <ImagePack 
              key={index} 
              title={pack.title} 
              images={pack.images}
              onDrop={(id, left, top) => handleDrop('pack', index, id, left, top)}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          {layoutSections.map((section, index) => (
            <LayoutSection
              key={index}
              title={section.title}
              allowDrop={section.allowDrop}
              images={section.images}
              onDrop={(id, left, top) => handleDrop('section', index, id, left, top)}
            />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DragDropLayout;