import React from 'react'

const Loader = props => (
  <svg
    width={30}
    height={30}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className="lds-flickr"
    style={{ background: "0 0" }}
    {...props}
  >
    <circle cy={50} cx={70} fill="#0059de" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1}
        begin="-0.5s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy={50} cx={30} fill="#2997f4" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1}
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy={50} cx={70} fill="#0059de" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1}
        begin="-0.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        values="0;0;1;1"
        calcMode="discrete"
        keyTimes="0;0.499;0.5;1"
        repeatCount="indefinite"
        dur="1s"
      />
    </circle>
  </svg>
)

export default Loader
