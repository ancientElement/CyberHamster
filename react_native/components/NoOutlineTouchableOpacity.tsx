import { ComponentProps } from "react";
import { Platform, TouchableOpacity } from "react-native";

type Props = ComponentProps<typeof TouchableOpacity>;

export function NoOutlineTouchableOpacity(props: Props) {
  const { style, ...rest } = props;
  const webStyle = Platform.OS === 'web' ? { outline: 'none' } : {};

  return (
    <TouchableOpacity
      {...rest}
      style={[style, webStyle]}
    />
  );
}