import React, { useState } from 'react';
import { Paper, Typography, styled } from '@mui/material';
import ImageThumbnail from '../atoms/ImageThumbnail';

interface ImagePackProps {
  title: string;
  images: string[];
  packIndex: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
}));

const ThumbnailContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
}));

const ImagePack: React.FC<ImagePackProps> = ({ title, images, packIndex }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" onClick={handleClick}>
        {title}
      </Typography>
      {isOpen && (
        <ThumbnailContainer>
          {images.map((image, index) => (
            <ImageThumbnail
              key={`${packIndex}-${index}`}
              id={`${packIndex}-${index}`}
              src={image}
              alt={`Image ${index + 1}`}
            />
          ))}
        </ThumbnailContainer>
      )}
    </StyledPaper>
  );
};

export default ImagePack;
