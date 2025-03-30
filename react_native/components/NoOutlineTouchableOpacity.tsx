import { ComponentProps } from "react";
import { Platform, TouchableOpacity } from "react-native";

type Props = ComponentProps<typeof TouchableOpacity>


export function NoOutlineTouchableOpacity(props: Props) {
  const { style, ...rest } = props;
  return <TouchableOpacity
    {...rest}
    style={[style,{
      ...Platform.select({
        web: {
          outline: "none",
        },
      }),
    }]}
  ></TouchableOpacity>
}