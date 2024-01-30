
import { SwipeableDrawer, List, ListItem } from '@mui/material';
import Link from 'next/link';

const ListC = (props) => {
  const { classes, onClick, onKeyDown, listItems } = props
  return (<div
    className={classes.listwrapper + " min-w-200 w-full max-w-400"}
    role="presentation"
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    <List>
      {listItems.map((item, index) => {
        if (item.target) {
          return (
            <ListItem key={item.href}>
              <a rel="noopener" className={classes.link} href={item.href} target={item.target} onClick={item.onClick}>
                {item.title}
              </a>
            </ListItem>
          )
        }
        return <ListItem key={item.href}>
          <Link href={item.href} style={{ textDecoration: 'none' }} onClick={item.onClick} prefetch={false}>
            <span className={classes.link}>
              {item.title}
            </span>
          </Link>
        </ListItem>
      })}
    </List>
  </div>)
}

const MenuDrawer = ({ classes, listItems, open, onClose, onOpen }) => {
  return <SwipeableDrawer key={open} anchor={'left'} className={classes.drawer} open={open} onClose={onClose} onOpen={onOpen}>
    <ListC listItems={listItems} classes={{ listwrapper: classes.listwrapper, link: classes.link }} onClick={onClose} />
  </SwipeableDrawer>
}

export default MenuDrawer

