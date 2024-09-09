import React, { useState, useCallback } from 'react';
import { Grid, styled, Button } from '@mui/material';
import { useDragLayer, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ImagePack from '../molecules/ImagePack';
import LayoutSection from '../organisms/LayoutSection';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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
  width: number;
  height: number;
  productId?: number;
  name?: string;
  photography?: string;
}

interface Section {
  title: string;
  allowDrop: boolean;
  images: Image[];
  position: { row: number; column: number };
  span: { columns: number; rows: number };
  cutDetails: {
    headline: string;
    callToAction: string;
    copyDirection: string;
    stylingDirection: string;
    artDirectorNotes: string;
    copywriterNotes: string;
  };
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
        { id: '1', src: 'https://via.placeholder.com/100?text=1', left: 10, top: 10, width: 100, height: 100 },
        { id: '2', src: 'https://via.placeholder.com/100?text=2', left: 120, top: 10, width: 100, height: 100 },
      ]
    },
    { 
      title: 'Pack 2', 
      images: [
        { id: '3', src: 'https://via.placeholder.com/100?text=3', left: 10, top: 10, width: 100, height: 100 },
        { id: '4', src: 'https://via.placeholder.com/100?text=4', left: 120, top: 10, width: 100, height: 100 },
      ]
    },
  ]);

  const [layoutSections, setLayoutSections] = useState<Section[]>([
    {
      title: 'Header',
      allowDrop: false,
      images: [],
      position: { row: 0, column: 0 },
      span: { columns: 12, rows: 2 },
      cutDetails: {
        headline: 'Header Section',
        callToAction: '',
        copyDirection: '',
        stylingDirection: '',
        artDirectorNotes: '',
        copywriterNotes: '',
      }
    },
    {
      title: 'Content 1',
      allowDrop: true,
      images: [],
      position: { row: 2, column: 0 },
      span: { columns: 6, rows: 5 },
      cutDetails: {
        headline: 'Content Section 1',
        callToAction: '',
        copyDirection: '',
        stylingDirection: '',
        artDirectorNotes: '',
        copywriterNotes: '',
      }
    },
    {
      title: 'Content 2',
      allowDrop: true,
      images: [],
      position: { row: 2, column: 6 },
      span: { columns: 6, rows: 5 },
      cutDetails: {
        headline: 'Content Section 2',
        callToAction: '',
        copyDirection: '',
        stylingDirection: '',
        artDirectorNotes: '',
        copywriterNotes: '',
      }
    },
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

  const captureLayoutData = () => {
    const layoutData = {
      value: {
        adId: 2105611, // This should be dynamic in a real application
        cutLayouts: {
          created: [],
          updated: layoutSections.map((section, index) => ({
            adId: 2105611,
            cutNumber: index + 1,
            position: section.position,
            span: section.span,
            id: 878866 + index, // This should be dynamic in a real application
            name: section.title
          }))
        },
        cutContentItems: {
          imported: [],
          created: [],
          updated: layoutSections.flatMap((section, sectionIndex) => 
            section.images.map((image, imageIndex) => ({
              parentType: 1,
              adId: 2105611,
              cutNumber: sectionIndex + 1,
              contentBlockId: 365847 + imageIndex, // This should be dynamic
              productId: image.productId || parseInt(image.id) * 1000,
              photography: image.photography || "New",
              size: {
                width: image.width / 300, // Assuming container width is 300px
                height: image.height / 300 // Assuming container height is 300px
              },
              position: {
                top: image.top / 300,
                left: image.left / 300
              },
              createdBy: "System",
              modifiedBy: "System",
              lastModifiedDate: new Date().toISOString(),
              id: 1886563 + imageIndex, // This should be dynamic
              name: image.name || `Image ${image.id}`
            }))
          )
        },
        cutContentItemExclusions: {
          created: [],
          updated: []
        },
        cutDetails: {
          imported: [],
          created: [],
          updated: layoutSections.map((section, index) => ({
            parentType: 1,
            adId: 2105611,
            cutNumber: index + 1,
            childCuts: [],
            cutHeadline: section.cutDetails.headline,
            callToAction: section.cutDetails.callToAction,
            copyDirection: section.cutDetails.copyDirection,
            stylingDirection: section.cutDetails.stylingDirection,
            artDirectorNotes: section.cutDetails.artDirectorNotes,
            copywriterNotes: section.cutDetails.copywriterNotes,
            createdBy: "System",
            modifiedBy: "System",
            lastModifiedDate: new Date().toISOString(),
            attachments: [],
            photographyOverrides: [],
            id: 878866 + index, // This should be dynamic
            name: section.title
          }))
        }
      },
      isSuccess: true,
      errorCodeId: 0
    };

    console.log(JSON.stringify(layoutData, null, 2));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <StyledButton variant="contained" color="primary" onClick={captureLayoutData}>
          Capture Layout Data
        </StyledButton>
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
                cutNumber={index + 1}
                position={section.position}
                span={section.span}
                cutDetails={section.cutDetails}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
};

export default DragDropLayout;