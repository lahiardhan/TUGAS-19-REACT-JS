import React, { Component } from "react";
import {
	Container,
	Navbar,
	Row,
	Col,
	Button,
	ButtonGroup,
} from "react-bootstrap";
import axios from "axios";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataAPI: [],
			dataState: {
				id: 0,
				nama: "",
				jabatan: "",
				gender: "",
				birth: "",
			},
			isEdit: false,
		};

		this.onSubmitAction = this.onSubmitAction.bind(this);
	}

	loadData = () => {
		axios.get("http://localhost:3005/posts").then((res) => {
			this.setState({
				dataAPI: res.data,
			});
		});
	};

	clearData = () => {
		let newDataPost = { ...this.state.dataState };
		newDataPost.id = 0;
		newDataPost.nama = "";
		newDataPost.jabatan = "";
		newDataPost.gender = "";
		newDataPost.birth = "";

		this.setState({
			dataState: newDataPost,
			isEdit: false,
		});
	};

	deleteData = (e) => {
		axios.delete(`http://localhost:3005/posts/${e.target.id}`).then(() => {
			this.loadData();
		});
	};

	editData = (e) => {
		axios.get(`http://localhost:3005/posts/${e.target.id}`).then((res) => {
			this.setState({
				dataState: res.data,
				isEdit: true,
			});
		});
	};

	inputChange = (e) => {
		let newDataPost = { ...this.state.dataState };

		if (this.state.isEdit === false) {
			newDataPost["id"] = new Date().getTime();
		}

		newDataPost[e.target.name] = e.target.value;
		this.setState(
			{
				dataState: newDataPost,
			},
			() => console.log(this.state.dataState)
		);
	};

	onSubmitAction() {
		if (this.state.isEdit === false) {
			axios
				.post("http://localhost:3005/posts", this.state.dataState)
				.then(() => {
					this.loadData();
					this.clearData();
				});
		} else {
			axios
				.put(
					`http://localhost:3005/posts/${this.state.dataState.id}`,
					this.state.dataState
				)
				.then(() => {
					this.loadData();
					this.clearData();
				});
		}
	}

	componentDidMount() {
		this.loadData();
	}

	render() {
		return (
			<div>
				<Navbar className="header">
					<Container className="justify-content-center">
						<Row>
							<h1>Data Karyawan</h1>
						</Row>
					</Container>
				</Navbar>

				<br />
				<Container className="mb-5">
					<Row>
						<Col
							md={4}
							className="content left-content me-md-4 py-3 mb-4"
						>
							<h4 align="center">Masukkan Data Karyawan</h4>
							<Container>
								<Row className="my-3">
									<input
										type="text"
										name="nama"
										placeholder="Nama Karyawan"
										onChange={this.inputChange}
										value={this.state.dataState.nama}
									/>
								</Row>
								<Row className="mb-3">
									<input
										type="text"
										name="jabatan"
										placeholder="Posisi/Jabatan"
										onChange={this.inputChange}
										value={this.state.dataState.jabatan}
									/>
								</Row>
								<Row className="mb-3">
									<input
										type="text"
										name="gender"
										placeholder="Jenis Kelamin"
										onChange={this.inputChange}
										value={this.state.dataState.gender}
									/>
								</Row>
								<Row className="mb-3">
									<input
										type="date"
										name="birth"
										onChange={this.inputChange}
										value={this.state.dataState.birth}
									/>
								</Row>
								<Row>
									<button
										className="submitBtn p-2"
										onClick={this.onSubmitAction}
									>
										Save Data
									</button>
								</Row>
							</Container>
						</Col>

						<Col md={7} className="content p-3">
							<h4 align="center">Daftar Karyawan</h4>
							{this.state.dataAPI.map((data, index) => {
								return (
									<div key={index}>
										<Container className="content p-3 my-3">
											<table>
												<tbody>
													<tr>
														<td>Nama</td>
														<td className="px-2">:</td>
														<td>{data.nama}</td>
													</tr>
													<tr>
														<td>Posisi/Jabatan</td>
														<td className="px-2">:</td>
														<td>{data.jabatan}</td>
													</tr>
													<tr>
														<td>Jenis Kelamin</td>
														<td className="px-2">:</td>
														<td>{data.gender}</td>
													</tr>
													<tr>
														<td>Tanggal Lahir</td>
														<td className="px-2">:</td>
														<td>{data.birth}</td>
													</tr>
												</tbody>
											</table>
											<div className="d-flex justify-content-center mt-2">
												<ButtonGroup>
													<Button
														id={data.id}
														onClick={this.editData}
													>
														EDIT
													</Button>
													<Button
														id={data.id}
														onClick={this.deleteData}
														variant="danger"
													>
														DELETE
													</Button>
												</ButtonGroup>
											</div>
										</Container>
									</div>
								);
							})}
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default App;
