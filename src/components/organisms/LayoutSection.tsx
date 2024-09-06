import React from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, styled } from '@mui/material';
import ImageThumbnail from '../atoms/ImageThumbnail';

interface LayoutSectionProps {
  title: string;
  allowDrop: boolean;
  images: Array<{
    id: string;
    src: string;
    position: { x: number; y: number };
  }>;
  onDrop: (item: any, position: { x: number; y: number }) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 200,
  marginBottom: theme.spacing(2),
  position: 'relative',
}));

const DropArea = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const LayoutSection: React.FC<LayoutSectionProps> = ({
  title,
  allowDrop,
  images,
  onDrop,
  onMove,
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: 'IMAGE',
      drop: (item: any, monitor) => {
        const offset = monitor.getClientOffset();
        if (offset && allowDrop) {
          const containerRect = monitor.getTargetRect() as DOMRect;
          const x = offset.x - containerRect.left;
          const y = offset.y - containerRect.top;
          onDrop(item, { x, y });
        }
      },
    }),
    [allowDrop, onDrop]
  );

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <DropArea ref={drop}>
        {images.map((image) => (
          <ImageThumbnail
            key={image.id}
            id={image.id}
            src={image.src}
            alt={`Image ${image.id}`}
            position={image.position}
          />
        ))}
      </DropArea>
    </StyledPaper>
  );
};

export default LayoutSection;
