import React, { useState } from 'react';
import { Grid, styled } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import ImagePack from '../molecules/ImagePack';
import LayoutSection from '../organisms/LayoutSection';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

const DragDropLayout: React.FC = () => {
  const [imagePacks, setImagePacks] = useState([
    { title: 'Pack 1', images: ['/image1.jpg', '/image2.jpg', '/image3.jpg'] },
    { title: 'Pack 2', images: ['/image4.jpg', '/image5.jpg', '/image6.jpg'] },
  ]);

  const [layoutSections, setLayoutSections] = useState([
    { title: 'Header', allowDrop: false, images: [] },
    { title: 'Content 1', allowDrop: true, images: [] },
    { title: 'Content 2', allowDrop: true, images: [] },
    { title: 'Content 3', allowDrop: true, images: [] },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId.startsWith('pack-') && destId.startsWith('pack-')) {
      // Reordering within the same pack or between packs
      const newImagePacks = [...imagePacks];
      const sourcePack = parseInt(sourceId.split('-')[1]);
      const destPack = parseInt(destId.split('-')[1]);

      const [removed] = newImagePacks[sourcePack].images.splice(
        source.index,
        1
      );
      newImagePacks[destPack].images.splice(destination.index, 0, removed);

      setImagePacks(newImagePacks);
    } else if (sourceId.startsWith('pack-') && destId.startsWith('section-')) {
      // Moving from pack to section
      const newImagePacks = [...imagePacks];
      const newLayoutSections = [...layoutSections];

      const sourcePack = parseInt(sourceId.split('-')[1]);
      const destSection = parseInt(destId.split('-')[1]);

      const [removed] = newImagePacks[sourcePack].images.splice(
        source.index,
        1
      );
      newLayoutSections[destSection].images.splice(
        destination.index,
        0,
        removed
      );

      setImagePacks(newImagePacks);
      setLayoutSections(newLayoutSections);
    } else if (
      sourceId.startsWith('section-') &&
      destId.startsWith('section-')
    ) {
      // Moving between sections or within the same section
      const newLayoutSections = [...layoutSections];
      const sourceSection = parseInt(sourceId.split('-')[1]);
      const destSection = parseInt(destId.split('-')[1]);

      const [removed] = newLayoutSections[sourceSection].images.splice(
        source.index,
        1
      );
      newLayoutSections[destSection].images.splice(
        destination.index,
        0,
        removed
      );

      setLayoutSections(newLayoutSections);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {imagePacks.map((pack, index) => (
              <ImagePack
                key={index}
                title={pack.title}
                images={pack.images}
                packIndex={index}
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
                sectionIndex={index}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </DragDropContext>
  );
};

export default DragDropLayout;
