import Spiral from './components/Spiral'
import Flower from './components/Flower'

// export Foo and Bar as named exports
export { Spiral, Flower }

// alternative, more concise syntax for named exports
// export { default as Foo } from './Foo'

// you can optionally also set a default export for your module
export default { Spiral, Flower }