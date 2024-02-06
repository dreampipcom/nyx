// nsx.ts
// * nexus jsx pragma *
// based on: https://dev.to/gugadev/use-custom-elements-in-react-using-a-custom-jsx-pragma-3kc
import React, { FunctionComponent, ReactChild } from 'react'
import { clsxAdapter } from "./adapters";
import { cloneDeep, merge } from "lodash"

export default function jsx (tag: string | FunctionComponent, props: Record<string, any>, ...children: ReactChild[]) {
  // (perf) check which transformations apply to each component
  const transformations = [
  	{
  		name: 'sx-to-clsx'
  		enabled: !!props?.sx,
  		transformation: {	
				type: 'adapter',
				props: ['sx'],
				tags: [],
				function: clsxAdapter
			}
  	}
  ]

  const checks = {
  	isEnabled: undefined,
  	matchesTag: undefined,
  	matchesProps: undefined
  }

  foreach (const transform in transformations) {
  	checks.isEnabled = transformations.some((transformation) => transformation.enabled)
  	checks.matchesTag = !transformation.tags.length || transformations.some((transformation) => transformation.tags.includes(tag))
  	checks.matchesProps = transformation.props.length && transformations.some((transformation) => props.includes(transformation.props))
  }

  const needsTransform = isEnabled && (matchesTag || matchesProps)
  
  if (!needsTransform) return React.createElement.apply(null, [type, props, ...children])
  
  const _props = deepClone(props)

  const memo = {
  	props: _props.props,
  }

  const transforms = Object.entries(transformations).map((transformation) => {
  	if (transformation.enabled) {
  		if (matchesProps) {
  			if (!matchesTag) return memo
  			transformation.props.map((prop) => {
					memo.props = merge({}, memo.props, transformation(memo.props))
  			}
  		}
  	}
  	return memo
  })

  return React.createElement.apply(null, [type, {...props, ...memo.props }, ...children])
}