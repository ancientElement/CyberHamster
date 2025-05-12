import { Platform, TextInput, TextInputProps } from 'react-native';

export function NoOutlineTextInput(props: TextInputProps) {
  const { style, ...rest } = props;
  const webStyle = Platform.OS === 'web' ? { outline: 'none' } : {};

  return (
    <TextInput
      {...rest}
      style={[style, webStyle]}
    />
  );
}
