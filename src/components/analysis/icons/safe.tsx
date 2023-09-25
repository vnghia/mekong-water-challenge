import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg"

export const safeIconAspectRatio = 168 / 195

const SafeIcon = () => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 168 195"
    preserveAspectRatio="xMinYMin slice"
  >
    <Path
      d="M100.429 19.4021L107.539 4.18576"
      stroke="url(#linear_gradient_1)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M110.491 24.8996L117.513 19.2603"
      stroke="url(#linear_gradient_2)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M90.0791 16.3962L88.5949 7.51319"
      stroke="url(#linear_gradient_3)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M127.032 191H9.9128C6.77599 191 4.23309 188.457 4.23309 185.32V92.5518C4.23309 89.415 6.77599 86.8721 9.9128 86.8721H36.1116C42.7619 86.8721 48.9244 83.3828 52.3459 77.6803L78.003 34.918C83.5398 25.691 96.5795 24.8139 103.301 33.2164C106.47 37.177 107.491 42.4411 106.033 47.2993L96.3551 79.5603C95.2618 83.2045 97.9909 86.8721 101.795 86.8721H145.104C157.587 86.8721 166.654 98.7426 163.369 110.786L145.297 177.049C143.051 185.286 135.57 191 127.032 191Z"
      fill="url(#linear_gradient_4)"
      stroke="white"
      strokeWidth={7.66588}
      strokeLinecap="round"
    />
    <Path d="M37.3647 191V86.872V191Z" fill="url(#linear_gradient_4)" />
    <Path
      d="M37.3647 191V86.872"
      stroke="white"
      strokeWidth={7.66588}
      strokeLinecap="round"
      stroke-linejoin="round"
    />
    <Defs>
      <LinearGradient
        id="linear_gradient_1"
        x1={103.785}
        y1={4.28531}
        x2={104.183}
        y2={19.3025}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#174AFF" />
        <Stop offset={1} stopColor="#69BDFD" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_2"
        x1={115.683}
        y1={18.4198}
        x2={112.322}
        y2={25.7401}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#174AFF" />
        <Stop offset={1} stopColor="#69BDFD" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_3"
        x1={86.9667}
        y1={8.69832}
        x2={91.7073}
        y2={15.211}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#174AFF" />
        <Stop offset={1} stopColor="#69BDFD" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_4"
        x1={84.14}
        y1={27.4208}
        x2={84.14}
        y2={191}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#3C94FF" />
        <Stop offset={1} stopColor="#174AFF" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_4"
        x1={37.8647}
        y1={86.872}
        x2={37.8647}
        y2={191}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#3C94FF" />
        <Stop offset={1} stopColor="#174AFF" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default SafeIcon
