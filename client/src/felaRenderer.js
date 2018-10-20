import { createRenderer } from 'fela'
import webPreset from 'fela-preset-web'
import monolithic from 'fela-monolithic'

export default function felaRenderer () {
  return createRenderer({
    plugins: [
      ...webPreset
    ],
    enhancers: [
      monolithic()
    ]
  })
}
