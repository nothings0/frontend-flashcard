import React from 'react';

const List = ({
    data = [],
    columns,
    onEdit,
    onDelete,
    currentPage = 1,
    limit = 10,
    total = 0,
    onPageChange = () => { },
    customRender = {},
}) => {
    if (!data || data.length === 0) return <div className="list">No data found.</div>;

    // Giới hạn cột là các key từ columns
    const headers = columns || Object.keys(data[0] || {}).filter((k) => k !== '_id' && k !== '__v');

    // Hàm để truy cập giá trị của các cột nếu nó là một chuỗi dạng "object.property"
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Hàm để chuyển đổi key thành format dễ đọc cho thead
    const formatHeader = (key) => {
        return key
            .split('.')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Viết hoa chữ cái đầu tiên
            .join(' '); // Thêm khoảng trắng giữa các phần
    };

    return (
        <div className="list">
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        {headers.map((key) => (
                            <th key={key}>{formatHeader(key)}</th>
                        ))}
                        {(onEdit || onDelete) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item._id || item.id || JSON.stringify(item)}>
                            <td>{index + 1 + (currentPage - 1) * limit}</td>
                            {headers.map((key) => (
                                <td key={key}>
                                    {customRender[key]
                                        ? customRender[key](getNestedValue(item, key), item)
                                        : getNestedValue(item, key)?.toString()}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td>
                                    {onEdit && (
                                        <button onClick={() => onEdit(item)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => onDelete(item)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <i className="fa-solid fa-angle-left"></i>
                </button>

                {Array.from({ length: Math.ceil(total) }, (_, i) => i + 1)
                    .filter((page) =>
                        page === 1 ||
                        page === Math.ceil(total) ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .reduce((acc, page, i, arr) => {
                        if (i > 0 && page - arr[i - 1] > 1)
                            acc.push(<span key={`dot-${page}`} className="dot">...</span>);
                        acc.push(
                            <button
                                key={page}
                                className={currentPage === page ? 'page active' : 'page'}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        );
                        return acc;
                    }, [])}

                <button
                    disabled={currentPage >= Math.ceil(total)}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <i className="fa-solid fa-angle-right"></i>
                </button>
            </div>
        </div>
    );
};

export default List;
