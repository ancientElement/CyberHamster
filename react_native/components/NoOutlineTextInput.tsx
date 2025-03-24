import { Platform, TextInput, TextInputProps } from 'react-native';

export function NoOutlineTextInput (props:TextInputProps) {
  const { style, ...rest } = props;

  return (
    <TextInput
      {...rest}
      style={[
        style,
        {...Platform.select({
          web: {
            outline: 'none',
            border: 'none'
          }
        })}
      ]}
    />
  );
};
