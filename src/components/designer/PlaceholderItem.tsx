import React, { useRef, useState, useEffect } from 'react';
import { Group, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';
import { Placeholder } from '../../types';

interface PlaceholderItemProps {
  placeholder: Placeholder;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attr: Partial<Placeholder>) => void;
}

export const PlaceholderItem: React.FC<PlaceholderItemProps> = ({ 
  placeholder, 
  isSelected, 
  onSelect, 
  onChange 
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (placeholder.staticUrl) {
      const image = new Image();
      image.src = placeholder.staticUrl;
      image.onload = () => setImg(image);
    } else {
      setImg(null);
    }
  }, [placeholder.staticUrl]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    node.scaleX(1);
    node.scaleY(1);
    
    const newWidth = Math.max(10, node.width() * scaleX);
    const newHeight = Math.max(10, node.height() * scaleY);
    const rotation = node.rotation();
    
    if (placeholder.type === 'text') {
      const isCorner = Math.abs(scaleX - scaleY) < 0.05;
      onChange({
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        rotation,
        ...(isCorner ? { fontSize: Math.round((placeholder.fontSize || 24) * scaleX) } : {})
      });
    } else {
      onChange({
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        rotation,
      });
    }
  };

  return (
    <>
      <Group
        draggable
        ref={shapeRef}
        x={placeholder.x}
        y={placeholder.y}
        width={placeholder.width}
        height={placeholder.height}
        rotation={placeholder.rotation || 0}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={placeholder.width}
          height={placeholder.height}
          stroke={isSelected ? '#7C3AED' : 'rgba(0,0,0,0.1)'}
          strokeWidth={2}
          dash={[5, 5]}
          fill={placeholder.type === 'image' ? 'rgba(124, 58, 237, 0.05)' : 'transparent'}
        />
        {placeholder.type === 'text' ? (
          <Text
            text={`{${placeholder.label}}`}
            width={placeholder.width}
            height={placeholder.height}
            fontSize={placeholder.fontSize}
            fontFamily={placeholder.fontFamily}
            fill={placeholder.fill}
            align={placeholder.align}
            verticalAlign="middle"
            wrap={placeholder.wrap || 'none'}
          />
        ) : (
          <Group width={placeholder.width} height={placeholder.height}>
            {img ? (
              <KonvaImage 
                image={img} 
                width={placeholder.width} 
                height={placeholder.height}
                crop={{
                  x: (img.width / 2) * (1 - 1/(placeholder.zoom || 1)) + (placeholder.offsetX || 0) * (img.width / 100),
                  y: (img.height / 2) * (1 - 1/(placeholder.zoom || 1)) + (placeholder.offsetY || 0) * (img.height / 100),
                  width: img.width / (placeholder.zoom || 1),
                  height: img.height / (placeholder.zoom || 1)
                }}
              />
            ) : (
              <>
                <Rect width={placeholder.width} height={placeholder.height} fill="rgba(255,255,255,0.1)" />
                <Text 
                  text={placeholder.isFrame ? '[FRAME]' : (placeholder.label ? `{${placeholder.label}}` : '[IMAGE]')} 
                  x={0} 
                  y={placeholder.height/2 - 10} 
                  width={placeholder.width} 
                  align="center" 
                  fill="white" 
                  fontSize={14}
                />
              </>
            )}
          </Group>
        )}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={
            placeholder.type === 'text' 
              ? ['middle-left', 'middle-right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] 
              : ['top-left', 'top-right', 'bottom-left', 'bottom-right']
          }
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
          anchorFill="#7C3AED"
          anchorStroke="#FFFFFF"
          anchorCornerRadius={3}
          borderStroke="#7C3AED"
          borderStrokeWidth={2}
        />
      )}
    </>
  );
};
