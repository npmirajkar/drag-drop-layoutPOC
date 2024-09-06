import React from 'react';
import { useDrag } from 'react-dnd';
import { Paper, styled } from '@mui/material';

interface ImageThumbnailProps {
  id: string;
  src: string;
  alt: string;
  left: number;
  top: number;
}

const StyledPaper = styled(Paper)({
  width: 100,
  height: 100,
  position: 'absolute',
  cursor: 'move',
  transition: 'opacity 0.2s',
  '&.dragging': {
    opacity: 0.5,
  },
});

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ id, src, alt, left, top }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE',
    item: { id, src, left, top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, src, left, top]);

  return (
    <StyledPaper 
      ref={drag}
      elevation={3} 
      className={isDragging ? 'dragging' : ''}
      style={{ left, top }}
    >
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </StyledPaper>
  );
};

export default ImageThumbnail;