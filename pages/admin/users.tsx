import { PeopleOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

const UsersPage = () => {
	const { data, error } = useSWR<IUser[]>('/api/admin/users');
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);

	if (!data && !error) return <></>;

	if (error) return <div>Error</div>;

	const onRoleUpdate = async (userId: string, newRole: string) => {
		const prevUsers = users.map((user) => ({ ...user }));
		const updatedUsers = users.map((user) => ({
			...user,
			role: userId === user._id ? newRole : user.role,
		}));

		setUsers(updatedUsers);

		try {
			await tesloApi.put('/admin/users', { userId, role: newRole });
		} catch (error) {
			setUsers(prevUsers);
			console.log(error);
		}
	};

	const columns: GridColDef[] = [
		{ field: 'email', headerName: 'Correo', width: 250 },
		{ field: 'name', headerName: 'Nombre completo', width: 300 },
		{
			field: 'role',
			headerName: 'Rol',
			width: 300,
			renderCell: ({ row }: GridRenderCellParams) => {
				return (
					<>
						<Select
							value={row.role}
							label="Rol"
							onChange={({ target }) => onRoleUpdate(row.id, target.value)}
							sx={{ width: '300px' }}
						>
							<MenuItem value="admin">Admin</MenuItem>
							<MenuItem value="client">Cliente</MenuItem>
						</Select>
					</>
				);
			},
		},
	];

	const rows = users.map((user) => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	}));

	return (
		<AdminLayout
			title={'Usuarios'}
			subTitle={'Mantenimiento Usuarios'}
			icon={<PeopleOutline />}
		>
			<Grid container className="fadeIn">
				<Grid item xs={12} sx={{ heigth: '650px', width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
						autoHeight
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default UsersPage;
