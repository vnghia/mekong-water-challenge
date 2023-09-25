import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg"

export const warningIconAspectRatio = 184 / 187

const WarningIcon = () => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 184 187"
    preserveAspectRatio="xMinYMin slice"
  >
    <Path
      d="M161.357 181.489H23.2026C9.99315 181.489 1.72717 167.201 8.31168 155.75L77.3891 35.6149C83.9937 24.1284 100.566 24.1284 107.171 35.6148L176.249 155.75C182.833 167.201 174.567 181.489 161.357 181.489Z"
      fill="url(#linear_gradient_1)"
      stroke="white"
      strokeWidth={10}
      strokeLinecap="round"
    />
    <Path d="M92.2798 78.426V112.78V78.426Z" fill="url(#linear_gradient_2)" />
    <Path
      d="M92.2798 78.426V112.78"
      stroke="white"
      strokeWidth={10}
      strokeLinecap="round"
    />
    <Path
      d="M92.2798 147.22L92.3657 147.125L92.2798 147.22Z"
      fill="url(#linear_gradient_3)"
    />
    <Path
      d="M92.2798 147.22L92.3657 147.125"
      stroke="white"
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M118.814 25.3679L136.031 7.24042"
      stroke="url(#linear_gradient_4)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M130.426 37.8767L143 33.2281"
      stroke="url(#linear_gradient_5)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M105.62 16.2411L107.716 2.99997"
      stroke="url(#linear_gradient_6)"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Defs>
      <LinearGradient
        id="linear_gradient_1"
        x1={92.28}
        y1={27}
        x2={92.28}
        y2={181.489}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_2"
        x1={92.7798}
        y1={78.426}
        x2={92.7798}
        y2={112.78}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_3"
        x1={92.3227}
        y1={147.125}
        x2={92.3227}
        y2={147.22}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_4"
        x1={130.684}
        y1={5.60968}
        x2={124.161}
        y2={26.9986}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_5"
        x1={140.813}
        y1={31.1781}
        x2={132.613}
        y2={39.9267}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
      <LinearGradient
        id="linear_gradient_6"
        x1={104.858}
        y1={3.90495}
        x2={108.478}
        y2={15.3361}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CB0000" />
        <Stop offset={1} stopColor="#ED7A7A" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default WarningIcon
