import React, { useRef } from 'react';
import { Paper, Typography, styled } from '@mui/material';
import { useDrop } from 'react-dnd';
import ImageThumbnail from '../atoms/ImageThumbnail';

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

interface ImagePackProps {
  title: string;
  images: Image[];
  onDrop: (id: string, left: number, top: number) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  height: 300,
  transition: 'background-color 0.3s',
  '&.drop-active': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ImagePack: React.FC<ImagePackProps> = ({ title, images, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'IMAGE',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = ref.current?.getBoundingClientRect();
      if (offset && containerRect) {
        const left = offset.x - containerRect.left;
        const top = offset.y - containerRect.top;
        onDrop(item.id, left, top);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onDrop]);

  drop(ref);

  return (
    <StyledPaper elevation={3} ref={ref} className={isOver ? 'drop-active' : ''}>
      <Typography variant="h6">{title}</Typography>
      {images.map((image) => (
        <ImageThumbnail
          key={image.id}
          id={image.id}
          src={image.src}
          alt={`Image ${image.id}`}
          left={image.left}
          top={image.top}
          width={image.width}
          height={image.height}
          productId={image.productId}
          name={image.name}
          photography={image.photography}
        />
      ))}
    </StyledPaper>
  );
};

export default ImagePack;