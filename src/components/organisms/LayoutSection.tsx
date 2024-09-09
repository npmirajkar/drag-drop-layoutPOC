import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, styled } from '@mui/material';
import ImageThumbnail from '../atoms/ImageThumbnail';

interface LayoutSectionProps {
  title: string;
  allowDrop: boolean;
  images: Array<{
    id: string;
    src: string;
    left: number;
    top: number;
    width: number;
    height: number;
    productId?: number;
    name?: string;
    photography?: string;
  }>;
  onDrop: (id: string, left: number, top: number) => void;
  cutNumber: number;
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

const LayoutSection: React.FC<LayoutSectionProps> = ({ 
  title, 
  allowDrop, 
  images, 
  onDrop, 
  cutNumber, 
  position, 
  span, 
  cutDetails 
}) => {
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
          {...image}
          alt={`Image ${image.id}`}
        />
      ))}
    </StyledPaper>
  );
};

export default LayoutSection;