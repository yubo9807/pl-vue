import { binding, h, onMounted, reactive, watch } from "~/plvue"
import { Link } from "~/plvue/router"
import style from './style.module.scss';
import { joinClass } from "@/utils/string";

const o = reactive({
  tag: 1,
  children: [
    {tag: 2}
  ]
})
// binding(() => {
//   console.log(o.tag)
//   binding(() => {
//     console.log(o.children[0].tag)
//   })
// })

export default function Docs(props) {
  onMounted(() => {
    console.log('docs')
  })

  return <div className={joinClass('leayer', style.container)}>
    <ul className={style.side}>
      <li>
        <Link to='/docs/use'>使用</Link>
      </li>
      <li>
        <Link to='/docs/realize'>实现</Link>
      </li>
    </ul>
    <div className={style.content}>
      {props.children}
    </div>
  </div>
}
