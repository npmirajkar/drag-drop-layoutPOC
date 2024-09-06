import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, styled } from '@mui/material';
import ImageThumbnail from '../atoms/ImageThumbnail';

interface LayoutSectionProps {
  title: string;
  allowDrop: boolean;
  images: Array<{ id: string; src: string; left: number; top: number }>;
  onDrop: (id: string, left: number, top: number) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 300,
  marginBottom: theme.spacing(2),
  position: 'relative',
  transition: 'background-color 0.2s',
  '&.drop-active': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LayoutSection: React.FC<LayoutSectionProps> = ({ title, allowDrop, images, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'IMAGE',
    canDrop: () => allowDrop,
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = ref.current?.getBoundingClientRect();
      if (offset && containerRect) {
        const left = Math.max(0, offset.x - containerRect.left);
        const top = Math.max(0, offset.y - containerRect.top);
        onDrop(item.id, left, top);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && allowDrop,
    }),
  }), [allowDrop, onDrop]);

  drop(ref);

  return (
    <StyledPaper 
      elevation={3} 
      ref={ref}
      className={isOver ? 'drop-active' : ''}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {images.map((image) => (
        <ImageThumbnail
          key={image.id}
          id={image.id}
          src={image.src}
          alt={`Image ${image.id}`}
          left={image.left}
          top={image.top}
        />
      ))}
    </StyledPaper>
  );
};

export default LayoutSection;