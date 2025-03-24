import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { NoOutlineTextInput } from './NoOutLineTextInput';

interface AutoExpandingTextInputProps extends TextInputProps {
  maxHeight?: number;
}

const AutoExpandingTextInput: React.FC<AutoExpandingTextInputProps> = ({
  style,
  onContentSizeChange,
  maxHeight = 200,
  ...rest
}) => {
  const [height, setHeight] = useState(0);

  const handleContentSizeChange = (event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    setHeight(newHeight);
    onContentSizeChange?.(event);
  };

  return (
    <NoOutlineTextInput
      {...rest}
      multiline={true}
      onContentSizeChange={handleContentSizeChange}
      style={[
        style,
        { height: Math.min(maxHeight, height) }
      ]}
    />
  );
};

export default AutoExpandingTextInput;