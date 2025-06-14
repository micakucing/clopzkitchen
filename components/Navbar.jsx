import Link from 'next/link';
import { useSelector } from 'react-redux';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const cart = useSelector((state) => state.cart);

  const getItemsCount = () => {

    return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  };

  return (
    <nav className={styles.navbar}>
      <h6 className={styles.logo}>Clopzkicthen</h6>
      <ul className={styles.links}>
        <li className={styles.navlink}>
          <Link href="/">Awalan</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/shop">Toko</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/cart">
            <a>Keranjang ({getItemsCount()})</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
