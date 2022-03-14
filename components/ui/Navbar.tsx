import {
	AppBar,
	Badge,
	Box,
	Button,
	IconButton,
	Link,
	Toolbar,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

export const Navbar = () => {
	return (
		<AppBar>
			<Toolbar>
				<NextLink href="/" passHref>
					<Link display="flex" alignItems="center">
						<Typography variant="h6">Teslo |</Typography>
						<Typography sx={{ ml: 0.5 }}>Shop</Typography>
					</Link>
				</NextLink>
				<Box sx={{ flex: 1 }} />
				<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
					<NextLink href="category/men" passHref>
						<Link>
							<Button>Hombres</Button>
						</Link>
					</NextLink>
					<NextLink href="category/mujeres" passHref>
						<Link>
							<Button>Mujeres</Button>
						</Link>
					</NextLink>
					<NextLink href="category/kid" passHref>
						<Link>
							<Button>Niños</Button>
						</Link>
					</NextLink>
				</Box>
				<Box sx={{ flex: 1 }} />
				<IconButton>
					<SearchOutlined />
				</IconButton>
				<NextLink href="cart" passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={2} color="secondary">
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>
				<Button>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
