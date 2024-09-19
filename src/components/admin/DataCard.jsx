const DataCard = ({status, count}) => {
    return (
        <div className="rounded-2xl odd:bg-[#CFCEFF] even:bg-[#FAE27C] p-4 flex-1 min-w-[100px] shadow-custom">
            {/* <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    2024/25
                </span>
            </div> */}
            <h1 className="text-3xl font-semibold my-4">{count}</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{status}</h2>
        </div>
    );
};

export default DataCard;