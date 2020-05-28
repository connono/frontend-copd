<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(
	    <div style="display:inline-block">
		  <span slot='title'>{(title)}</span>
		</div>
	  )
    }
	//<div style="display:inline-block; width: 30px; height: 20px; border-radius: 50px; background-color: red; color: white;text-align: center;line-height: 20px; margin-left: 10px">20</div>
    return vnodes
	
  }
}
</script>
