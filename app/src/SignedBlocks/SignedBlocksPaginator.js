import React from "react";
import PropTypes from "prop-types";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";

SignedBlocksPaginator.propTypes = () => { 
	return { 
		changeSignatureMap: PropTypes.func,
		pageList: PropTypes.any,
		changeToFirstPage: PropTypes.func,
		changeToLastPage: PropTypes.func
	};
};

const nextPage = (pageList, changeSignatureMap) => {
	pageList.forEach((page,i) => {
		if(page.active && i < pageList.length-1){
			changeSignatureMap(pageList[i+1].atBlock);
		}
	});
};

const previousPage = (pageList, changeSignatureMap) => {
	pageList.forEach((page,i) => {
		if(page.active && i > 0){
			changeSignatureMap(pageList[i-1].atBlock);
		}
	});
};

export default function SignedBlocksPaginator(props) {

	const { pageList, changeSignatureMap, changeToLastPage, changeToFirstPage } = props;

	return (
		<div className="row">
			<div className="column" id="react-paginate">
				<Pagination>
					<Pagination.First onClick={() => changeToFirstPage()}/>
					<Pagination.Prev onClick={() => previousPage(pageList, changeSignatureMap)}/>
					{pageList.map((page, i) => 
						page.active ? <Pagination.Item key={i} active onClick={() => changeSignatureMap(page.atBlock)}>{page.atBlock}</Pagination.Item> 
							: <Pagination.Item key={i} onClick={() => changeSignatureMap(page.atBlock)}>{page.atBlock}</Pagination.Item>
					)}
					<Pagination.Next onClick={() => nextPage(pageList, changeSignatureMap)}/>
					<Pagination.Last onClick={() => changeToLastPage()}/>
				</Pagination>
			</div> 
		</div>
	);
}