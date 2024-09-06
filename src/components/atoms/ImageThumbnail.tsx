import React from 'react';
import { useDrag } from 'react-dnd';
import { Paper, styled } from '@mui/material';

interface ImageThumbnailProps {
  id: string;
  src: string;
  alt: string;
  position?: { x: number; y: number };
}

const StyledPaper = styled(Paper)<{ isDragging: boolean }>(
  ({ theme, isDragging }) => ({
    width: 100,
    height: 100,
    margin: theme.spacing(1),
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
    position: 'absolute',
    zIndex: 1000,
  })
);

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  id,
  src,
  alt,
  position,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE',
    item: { id, src, type: 'IMAGE' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <StyledPaper
      ref={drag}
      elevation={3}
      isDragging={isDragging}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </StyledPaper>
  );
};

export default ImageThumbnail;
