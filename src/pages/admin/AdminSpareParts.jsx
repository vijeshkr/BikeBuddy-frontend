import React, { useEffect, useRef, useState } from 'react';
import makeRequest from '../../common/axios';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { handleImageUpload } from '../../common/utils';
import { toast } from 'react-toastify';
import CreateSparePopup from '../../components/admin/CreateSparePopup';
import CreateVehiclePopup from '../../components/admin/CreateVehiclePopup';
import UpdateSparePopup from '../../components/admin/UpdateSparePopup';
import ImageView from '../../components/common/ImageView';
import LoadingIndicator from '../../components/LoadingIndicator';
import Pagination from '../../components/common/Pagination';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminSpareParts = () => {
  // State to manage spare parts data
  const [spareParts, setSpareParts] = useState([]);
  // State to manage search
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage vehicle image
  const [vehicleImg, setVehicleImg] = useState(null);
  // State to manage vehicle name
  const [vehicleName, setVehicleName] = useState('');
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage all vehicles
  const [allVehicles, setAllVehicles] = useState([]);
  // State to manage spare image
  const [spareImg, setSpareImg] = useState(null);
  // State to manage spare data
  const [data, setData] = useState({
    itemName: '',
    price: '',
    stock: '',
    suitable: ''
  });
  // State to manage open close spare
  const [openSpare, setOpenSpare] = useState(false);
  // State to manage open close vehicle
  const [openVehicle, setOpenVehicle] = useState(false);
  // State to manage current spare
  const [currentSpare, setCurrentSpare] = useState({});
  // Update work open close
  const [openUpdate, setOpenUpdate] = useState(false);
  // State to manage filtered data
  const [filterSuitable, setFilterSuitable] = useState('');
  // State to manage image viewer open close
  const [openImg, setOpenImg] = useState(false);
  // State to manage current image for image view
  const [currentImg, setCurrentImg] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sparePerPage] = useState(10);

  // Handle open image viewer
  const handleOpenImgViewer = (img) => {
    setOpenImg(!openImg);
    setCurrentImg(img);
  }

  // Handle close image viewer
  const handleCloseImgViewer = () => {
    setOpenImg(prev => !prev);
  }

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterSuitable(e.target.value);
  };

  // Handle current work and open update popup
  const handleUpdateOpen = (spare) => {
    setOpenUpdate(!openUpdate);
    setCurrentSpare(spare);
  }

  // Handle close function for set open update false 
  const handleCloseUpdate = () => {
    setOpenUpdate(prevOpenUpdate => !prevOpenUpdate);
  }

  // Handle open vehicle
  const handleOpenVehicle = () => {
    setOpenVehicle(!openVehicle);
  }

  // Handle close function for open vehicle
  const handleCloseVehicle = () => {
    setOpenVehicle(prev => !prev);
  }

  // Handle open spare
  const handleOpenSpare = () => {
    setOpenSpare(!openSpare);
  }

  // Handle close function for open spare
  const handleClose = () => {
    setOpenSpare(prev => !prev);
  }

  // Handle change in the form
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  // For vehicle image input field
  const fileInputRef = useRef(null);
  // For spare image input field
  const fileInputRefSpare = useRef(null);

  // Handle search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  // Handle vehicle image
  const handleVehicleImage = (e) => {
    if (e.target.files.length > 0) {
      setVehicleImg(e.target.files[0]);
    } else {
      setVehicleImg(null);
    }
  }

  // Handle spare image
  const handleSpareImage = (e) => {
    if (e.target.files.length > 0) {
      setSpareImg(e.target.files[0]);
    } else {
      setSpareImg(null);
    }
  }

  // Handle vehicle name
  const handleVehicleName = (e) => {
    setVehicleName(e.target.value);
  }

  // Handle submit vehicle form
  const handleSubmitVehicleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(vehicleImg);
      const vehicleData = { name: vehicleName, image: imageUrl }

      // Api call for add new vehicle
      const response = await makeRequest.post('/add-new-vehicle', vehicleData);
      if (response.data.success) {
        toast.success(response.data.message);
        // Clear the form and reset the state
        setVehicleName('');
        setVehicleImg(null);
        fetchVehicles();
      }
    } catch (error) {
      console.error('Failed to create new vehicle:', error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  // Handle submit spare form
  const handleSubmitSpareForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(spareImg);
      const updatedData = { ...data, image: imageUrl }

      const response = await makeRequest.post('/add-new-spare', updatedData);
      if (response.data.success) {
        toast.success(response.data.message);
        // Clear the form and reset the state
        setData({
          itemName: '',
          price: '',
          stock: '',
          suitable: ''
        });
        setSpareImg(null);
        fetchSpare();
      }
    } catch (error) {
      console.error('Failed to create new spare:', error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  // Vehicle img clear
  const clearVehicleImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVehicleImg(null);
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Spare img clear
  const clearSpareImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSpareImg(null);
    // Reset the file input value
    if (fileInputRefSpare.current) {
      fileInputRefSpare.current.value = ''
    }
  }


  // Function for fetch all spare parts details from the api
  const fetchSpare = async () => {
    try {
      const response = await makeRequest.get('/get-all-spare');
      if (response.data.success) {
        setSpareParts(response.data.data.reverse());
      }
    } catch (error) {
      console.error('Error while fetching spare parts: ', error);
    }
  }

  // Function for fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await makeRequest.get('/get-all-vehicles');
      if (response.data.success) {
        setAllVehicles(response.data.data);
      }
    } catch (error) {
      console.error('Error while fetching vehicles: ', error);
    }
  }

  // Delete spare
  const handleDelete = async (spareId) => {
    try {
      // Show confirmation alert
      const confirm = await swal({
        title: 'Are you sure?',
        text: 'Do you want to delete this item?',
        icon: 'warning',
        buttons: ['Cancel', 'Yes, delete it!'],
        dangerMode: true,
        className: 'swal-modal',
        didOpen: () => {
          // Add custom classes to the elements
          const swalTitle = document.querySelector('.swal-title');
          const swalText = document.querySelector('.swal-text');
          const swalButtonConfirm = document.querySelector('.swal-button--confirm');
          const swalButtonCancel = document.querySelector('.swal-button--cancel');

          if (swalTitle) swalTitle.classList.add('swal-title');
          if (swalText) swalText.classList.add('swal-text');
          if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
          if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
        },
      });

      if (!confirm) return; // Exit if user cancels

      // Show a loading alert
      const loadingAlert = swal({
        title: 'Deleting...',
        text: 'Please wait while we delete your item.',
        icon: 'info',
        buttons: false, // Disables buttons
        closeOnClickOutside: false,
        closeOnEsc: false,
        className: 'swal-modal',
        didOpen: () => {
          // Add custom classes to the elements
          const swalTitle = document.querySelector('.swal-title');
          const swalText = document.querySelector('.swal-text');

          if (swalTitle) swalTitle.classList.add('swal-title');
          if (swalText) swalText.classList.add('swal-text');
        },
      });

      // API call
      const response = await makeRequest.delete(`/delete-spare/${spareId}`);

      if (response.data.success) {
        fetchSpare();
      }

      // Close the loading alert
      swal.close();

      // Show success message
      await swal({
        title: 'Deleted!',
        text: 'Your item has been deleted.',
        icon: 'success',
        className: 'swal-modal',
        didOpen: () => {
          // Add custom classes to the elements
          const swalTitle = document.querySelector('.swal-title');
          const swalText = document.querySelector('.swal-text');
          const swalButtonConfirm = document.querySelector('.swal-button--confirm');
          const swalButtonCancel = document.querySelector('.swal-button--cancel');

          if (swalTitle) swalTitle.classList.add('swal-title');
          if (swalText) swalText.classList.add('swal-text');
          if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
          if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
        },
      });

    } catch (error) {
      // Close the loading alert if an error occurs
      swal.close();

      // Show error message
      await swal({
        title: 'Error!',
        text: 'There was an error deleting your item.',
        icon: 'error',
        className: 'swal-modal',
        didOpen: () => {
          // Add custom classes to the elements
          const swalTitle = document.querySelector('.swal-title');
          const swalText = document.querySelector('.swal-text');
          const swalButtonConfirm = document.querySelector('.swal-button--confirm');
          const swalButtonCancel = document.querySelector('.swal-button--cancel');

          if (swalTitle) swalTitle.classList.add('swal-title');
          if (swalText) swalText.classList.add('swal-text');
          if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
          if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
        },
      });
    }
  };

  // Search and filter spare
  const filteredData = spareParts
    .filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => filterSuitable === '' || item.suitable._id === filterSuitable);

  // Pagination logic
  const indexOfLastSpare = currentPage * sparePerPage;
  const indexOfFirstSpare = indexOfLastSpare - sparePerPage;
  const currentPageSpares = filteredData.slice(indexOfFirstSpare, indexOfLastSpare);

  const totalPages = Math.ceil(filteredData.length / sparePerPage);

  useEffect(() => {
    fetchSpare();
    fetchVehicles();
  }, []);


  return (
    <div className='flex flex-wrap gap-2 py-2'>
      {loading && <LoadingIndicator />}
      {/* All spare parts section */}
      <div className='flex-1'>

        <div className='bg-white p-4 rounded-lg'>
          <div className='py-2 flex justify-between flex-wrap gap-2'>
            {spareParts.length !== 0 &&
              <div className='border rounded-md px-2 flex items-center justify-between max-w-[250px]'>
                <input
                  onChange={handleSearch}
                  value={searchTerm}
                  className='outline-none p-1 text-sm'
                  type="text"
                  placeholder='Search' />
                <div className='px-2 text-gray-400'>
                  <IoSearch />
                </div>
              </div>}
            <div className='flex gap-1'>
              <button
                onClick={handleOpenVehicle}
                className='xl:hidden py-1 text-xs sm:text-sm px-2 rounded-md text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>Create Vehicle</button>
              <button
                onClick={handleOpenSpare}
                className='xl:hidden py-1 text-xs sm:text-sm px-2 rounded-md text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>Create Spare</button>
              {spareParts.length !== 0 &&
                <div className='flex xs:hidden justify-end'>
                  <select
                    onChange={handleFilterChange}
                    className='bg-bb-theme-500 text-white py-1 px-2 text-xs rounded-md cursor-pointer'>
                    <option value="">Suitable</option>
                    {allVehicles.map((vehicle, index) => (
                      <option
                        key={index}
                        value={vehicle._id}>{vehicle.name}</option>
                    ))}
                  </select>
                </div>}
            </div>
          </div>

          {/* Table section */}
          {currentPageSpares.length === 0 ? 'No spare parts available' :
            <div
            // className='xl:overflow-y-auto xl:scrollbar-none xl:max-h-[505px] xl:border-b'
            >
              <table className='hidden sm:table w-full divide-y divide-gray-200 min-w-[455px]'>
                <thead className='bg-bb-theme-50'>
                  <tr className='text-left'>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Image</th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Name</th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>
                      <select
                        onChange={handleFilterChange}
                        className='bg-bb-theme-50 cursor-pointer text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>
                        <option value="">Suitable</option>
                        {allVehicles.map((vehicle, index) => (
                          <option
                            key={index}
                            value={vehicle._id}>{vehicle.name}</option>
                        ))}
                      </select>
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Stocks</th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider min-w-16'>Price</th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Action</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentPageSpares.length === 0 ? <div className='p-5'>No spare parts available</div> :
                    currentPageSpares.map((spare, index) => (
                      <tr key={index} className='hover:bg-bb-theme-50 even:bg-gray-50'>
                        <td className='px-4 py-3'><img
                          onClick={() => handleOpenImgViewer(spare.image)}
                          className='h-12 w-12 rounded-full object-cover cursor-pointer' src={`${backendUrl}/images/${spare.image}`} alt="" /></td>
                        <td className='px-4 py-3'>{spare.itemName}</td>
                        <td className='px-4 py-3'>{spare.suitable.name}</td>
                        <td className='px-4 py-3'>{spare.stock === 0 ? <p className='text-red-500'>Out of stock</p> : spare.stock}</td>
                        <td className='px-4 py-3'><span>&#8377; </span>{spare.price}</td>
                        <td className='px-4 py-3'>
                          <div className='flex gap-5'>
                            <button
                              onClick={() => handleUpdateOpen(spare)}
                              className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit /></button>
                            <button
                              onClick={() => handleDelete(spare._id)}
                              className='bg-red-100 p-1.5 rounded-full text-red-600'><MdDeleteOutline /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              {/* Pagination component */}
              <div className='p-4 hidden sm:block'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

          }
          {/* Small screen devices card */}
          <div className='sm:hidden'>
            <div className='hidden xs:flex justify-end my-2'>
              {spareParts.length !== 0 &&
                <select
                  onChange={handleFilterChange}
                  className='bg-bb-theme-500 text-white py-1 px-2 text-xs rounded-md cursor-pointer'>
                  <option value="">Suitable</option>
                  {allVehicles.map((vehicle, index) => (
                    <option
                      key={index}
                      value={vehicle._id}>{vehicle.name}</option>
                  ))}
                </select>}
            </div>
            {
              filteredData.map((spare, index) => (
                <div key={index} className='min-w-[320px] text-sm flex flex-col gap-3 px-6 py-4 border border-gray-200 mb-4 rounded-lg'>
                  <div className='flex justify-between'>

                    <div>
                      <h1 className='font-medium'>{spare.itemName}</h1>
                      <h3 className='text-gray-500'>Suitable for {spare.suitable.name}</h3>
                      <p>{spare.stock === 0 ? <p className='text-red-500'>Out of stock</p> : `Stock : ${spare.stock}`}</p>
                    </div>

                    <div
                      className='cursor-pointer'
                      onClick={() => handleOpenImgViewer(spare.image)}>
                      <img
                        className='h-20 w-20 rounded-full object-cover'
                        src={`${backendUrl}/images/${spare.image}`} alt="" />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <h3 className='font-medium'>Price : <span>&#8377; </span>{spare.price}</h3>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleUpdateOpen(spare)}
                        className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit /></button>
                      <button
                        onClick={() => handleDelete(spare._id)}
                        className='bg-red-100 p-1.5 rounded-full text-red-600'><MdDeleteOutline /></button>

                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>

      <div className='flex flex-col gap-2'>
        {/* Create new spare parts section */}
        <form
          onSubmit={handleSubmitSpareForm}
          className='hidden xl:flex flex-col gap-2 bg-white p-4 rounded-lg min-w-[320px]'>
          <h1 className='p-2 font-semibold text-lg'>Create New Spare</h1>

          <div className='relative w-36'>
            <label htmlFor="uploadSpareImage" className='w-36'>
              <div className='p-2 bg-slate-100 border rounded-md h-20 w-36 flex justify-center items-center cursor-pointer'>
                <div className={`${spareImg && 'hidden'} text-slate-500 flex justify-center items-center flex-col gap-2`}>
                  <span className='text-3xl'><FaCloudUploadAlt /></span>
                  <p className='text-xs'>Upload spare image</p>
                  <input
                    ref={fileInputRefSpare}
                    onChange={handleSpareImage}
                    className='hidden'
                    id='uploadSpareImage'
                    type="file"
                    name="image" />
                </div>
              </div>
            </label>
            <div className={`${!spareImg && 'hidden'} absolute w-36 h-20 top-0 bottom-0 left-0 right-0`}>
              <div className='relative'>
                <img src={`${spareImg && URL.createObjectURL(spareImg)}`}
                  className='object-contain w-36 h-20'
                  alt="" />
                <span
                  className='absolute top-0 right-0 rounded-full bg-red-200 text-red-600 text-sm p-0.5 cursor-pointer'
                  onClick={clearSpareImage}
                ><IoMdClose /></span>
              </div>
            </div>
          </div>

          <input
            onChange={handleOnChange}
            value={data.itemName}
            name='itemName'
            className='text-sm outline-none border p-2 rounded-md' placeholder='Spare name' type="text" />

          <select
            onChange={handleOnChange}
            value={data.suitable}
            name='suitable'
            className='text-sm outline-none bg-gray-100 p-2 rounded-md'>
            <option value="">Select an option</option>
            {allVehicles.map((vehicle, index) => (
              <option
                key={index}
                value={vehicle._id}>{vehicle.name}</option>
            ))}
          </select>

          <input
            onChange={handleOnChange}
            value={data.stock}
            name='stock'
            className='text-sm outline-none border p-2 rounded-md' placeholder='Stock' type="number" />

          <input
            onChange={handleOnChange}
            value={data.price}
            name='price'
            className='text-sm outline-none border p-2 rounded-md' placeholder='Price' type="number" />
          <button className='p-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>Create</button>
        </form>

        {/* Create new vehicle section */}

        <form
          onSubmit={handleSubmitVehicleForm}
          className='hidden xl:flex flex-col gap-2 bg-gray-10 p-4 min-w-[320px] bg-white rounded-lg'>
          <h1 className='p-2 font-semibold text-lg'>Create New Vehicle</h1>
          <div className='relative w-36'>
            <label htmlFor="uploadVehicleImage" className='w-36'>
              <div className='p-2 bg-slate-100 border rounded-md h-20 w-36 flex justify-center items-center cursor-pointer'>
                <div className={`${vehicleImg && 'hidden'} text-slate-500 flex justify-center items-center flex-col gap-2`}>
                  <span className='text-3xl'><FaCloudUploadAlt /></span>
                  <p className='text-xs'>Upload vehicle image</p>
                  <input
                    ref={fileInputRef}
                    onChange={handleVehicleImage}
                    className='hidden'
                    id='uploadVehicleImage'
                    type="file"
                    name="image" />
                </div>
              </div>
            </label>
            <div className={`${!vehicleImg && 'hidden'} absolute w-36 h-20 top-0 bottom-0 left-0 right-0`}>
              <div className='relative'>
                <img src={`${vehicleImg && URL.createObjectURL(vehicleImg)}`}
                  className='object-contain w-36 h-20'
                  alt="" />
                <span
                  className='absolute top-0 right-0 rounded-full bg-red-200 text-red-600 text-sm p-0.5 cursor-pointer'
                  onClick={clearVehicleImage}
                ><IoMdClose /></span>
              </div>
            </div>
          </div>

          <input
            onChange={handleVehicleName}
            value={vehicleName}
            name='name'
            className='text-sm outline-none border p-2 rounded-md' placeholder='Vehicle name' type="text" />
          <button className='p-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>Create</button>
        </form>
      </div>
      {openSpare && <CreateSparePopup close={handleClose} fetchSpare={fetchSpare} allVehicles={allVehicles} />}
      {openVehicle && <CreateVehiclePopup close={handleCloseVehicle} fetchVehicle={fetchVehicles} />}
      {openUpdate && <UpdateSparePopup close={handleCloseUpdate} spare={currentSpare} fetchSpare={fetchSpare} />}
      {openImg && <ImageView close={handleCloseImgViewer} imgUrl={currentImg} />}
    </div>
  )
}

export default AdminSpareParts;