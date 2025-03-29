import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";

interface Nurse {
  employee_id: number;
  first_name: string;
  last_name: string;
  ward: string;
  email: string;
}

const App: React.FC = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [newNurse, setNewNurse] = useState<Nurse>({
    employee_id: 0,
    first_name: "",
    last_name: "",
    ward: "Red",
    email: "",
  });

  //const url = "http://localhost:3000/nurses"
  const url = "https://nursemanagement.onrender.com/nurses" //change for production
  //change for production



  const fetchNurses = async () => {
    try{
      console.log(page)
      console.log(search)
      console.log(`${url}` + "_pag" +`?search=${search}&page=${page}&limit=3`)
      const response = await fetch(`${url}` + "_pag" +`?search=${search}&page=${page}&limit=3`);
      console.log(response)
      const data: { nurses: Nurse[]; totalPages: number } = await response.json();
      setNurses(data.nurses);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error)
    }
  };

  const deleteNurse = async (id: number) => {
    try {
      const response = await fetch(url + `/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete nurse");
      }
  
      // After successful deletion, reload list
      await fetchNurses();
  
    } catch (error) {
      console.error("Error deleting nurse:", error);
    }
  };

  const addNurse = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: newNurse.first_name,
          last_name: newNurse.last_name,
          ward: newNurse.ward,
          email: newNurse.email,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add nurse");
      }
  
      const createdNurse = await response.json();
  
      fetchNurses();
    } catch (error) {
      console.error("Error adding nurse:", error);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, [page]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Add New Nurse</h2>
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center mb-4">
            <label className="font-medium">First Name</label>
            <input className="p-2 border border-gray-300 rounded" placeholder="First Name" value={newNurse.first_name} onChange={(e) => setNewNurse({ ...newNurse, first_name: e.target.value })} />
            <label className="font-medium">Last Name</label>
            <input className="p-2 border border-gray-300 rounded" placeholder="Last Name" value={newNurse.last_name} onChange={(e) => setNewNurse({ ...newNurse, last_name: e.target.value })} />
            <label className="font-medium">Ward</label>
            <select
              className="p-2 border border-gray-300 rounded"
              value={newNurse.ward}
              onChange={(e) => setNewNurse({ ...newNurse, ward: e.target.value })}
            >
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              <option value="Blue">Blue</option>
              <option value="Yellow">Yellow</option>
            </select>
            <label className="font-medium">Email</label>
            <input className="p-2 border border-gray-300 rounded" placeholder="Email" value={newNurse.email} onChange={(e) => setNewNurse({ ...newNurse, email: e.target.value })} />        
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addNurse}>Add Nurse</button>
          <br />
          <br />
        </div>

        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Search by name or ward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />    
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchNurses}>Search Nurse</button>      
        <br />
        <br />
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Ward</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nurses.length>0?
            nurses.map((nurse) => (
              <tr key={nurse.employee_id} className="text-center border border-gray-200">
                <td className="border border-gray-300 p-2">{nurse.first_name} {nurse.last_name}</td>
                <td className="border border-gray-300 p-2">{nurse.ward}</td>
                <td className="border border-gray-300 p-2">{nurse.email}</td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-500 p-1 mx-1 opacity-50 cursor-not-allowed" disabled><Pencil size={16} /></button>
                  <button className="text-red-500 p-1 mx-1"  onClick={() => deleteNurse(nurse.employee_id)}><Trash size={16} /></button>
                </td>
              </tr>
            )):<tr>No More Data</tr>}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => {
                setPage(page - 1) 
              }
            }
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => {
              setPage(page + 1) 
            }}
          >
            Next
          </button>
        </div>
      </div>
      <>for debug only<br />
      {nurses.toString()}<br />
      {search}<br />
      {page}<br />
      {totalPages}<br />
      {newNurse.first_name}<br />
      {newNurse.last_name}<br />
      {newNurse.ward}<br />
      {newNurse.email}<br />
      </>
    </div>
  );
};

export default App;
