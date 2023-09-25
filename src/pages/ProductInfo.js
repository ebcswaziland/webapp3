import {
    collection,
    doc,
    getDoc,
    getDocs,
    runTransaction,
    setDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";



function AdminPage() {
    const [confirmationCount, setConfirmationCount] = useState(0);
    const [voteSubmitted, setVoteSubmitted] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [editedRecord, setEditedRecord] = useState(null);
    const [status, setStatus] = useState(false);

    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [orders, setOrders] = React.useState([]);
    const [show, setShow] = React.useState(false);
    const [show2, setShow2] = React.useState(false);
    const [show3, setShow3] = React.useState(false);
    const [show4, setShow4] = React.useState(false);
    const [show5, setShow5] = React.useState(false);
    const [show6, setShow6] = React.useState(false);

    const [show7, setShow7] = React.useState(false);
    const [show8, setShow8] = React.useState(false);
    const [show9, setShow9] = React.useState(false);


    const [add, setAdd] = React.useState(false);
    const [tindvuna, setTindvuna] = React.useState([]);
    const [bucopho, setBucopho] = React.useState([]);
    const [turnout, setTurnout] = React.useState([]);
    const [station, setStation] = React.useState("");
    // const [poll, setPoll] = React.useState("");
    const phone = localStorage.getItem("phone");
    const [MP, setMP] = React.useState([]);

    const poll = localStorage.getItem("poll");
    const primary_poll = localStorage.getItem("primary_poll");

    // const pollstation = localStorage.getItem("pollstation");
    const [pollstation, setPollstation] = React.useState("");

    const [url, setUrl] = React.useState("");
    const [urlsecondary, setUrlSecondary] = React.useState("");


    //pdf download action buttons
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Navigate to the /test route
        navigate('/SHISELWENI');
    };
    const handleButtonClickLubombo = () => {
        // Navigate to the /test route
        navigate('/LUBOMBO');
    };
    const handleButtonClickHhohho = () => {
        // Navigate to the /test route
        navigate('/HHOHHO');
    };
    const handleButtonClickManzini = () => {
        // Navigate to the /test route
        navigate('/MANZINI');
    };


    // State to manage the selected country, state, and city
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    // Define event handlers for dropdown changes
    const handleCountryChange = (event) => {
        setCountry(event.target.value);
        setState(''); // Reset state when country changes
        setCity(''); // Reset city when country changes
    };

    const handleStateChange = (event) => {
        setState(event.target.value);
        setCity(''); // Reset city when state changes
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleMobileNumberChange = (e) => {
        setMobileNumber(e.target.value);
    };

    const handleStateChangeqaz = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    // State to manage the selected dependency
    const [selectedDependency, setSelectedDependency] = useState('');

    // Define your dependency options (you can replace these with your actual options)
    const countriesData = [

        {
            name: "Hhohho",
            states: [
                {
                    name: "Hhukwini",
                    cities: ["Dlangeni", "KaSiko", "LaMgabhi", "Sitseni"]
                },
                {
                    name: "Lobamba",
                    cities: ["Elangeni", "Ezabeni", "Ezulwini", "Lobamba", "Nkhanini"]
                },
                {
                    name: "Maphalaleni",
                    cities: ["Edlozini", "Madlolo", "Maphalaleni", "Mncengeni", "Mfeni", "Nsingweni"]
                },
                {
                    name: "Mayiwane",
                    cities: ["Hereford's", "Mavula", "Mfasini", "Mkhuzweni", "Mkhweni"]
                },
                {
                    name: "Mbabane East",
                    cities: ["Fonteyn", "Mdzimba_Lofokati", "Msunduza", "Sidvwashini"]
                },
                {
                    name: "Mbabane West",
                    cities: ["Mangwaneni", "Manzana", "Nkwalini"]
                },
                {
                    name: "Mhlangatane",
                    cities: ["Malibeni", "Mangweni", "Mphofu", "Ndwabangeni", "Nhlanguyavuka", "Nyakatfo", "Sidvwashini", "Zinyane"]
                },
                {
                    name: "Motshane",
                    cities: ["Kupheleni", "Mpolonjeni", "Nduma"]
                },
                {
                    name: "Ndzingeni",
                    cities: ["Bulandzeni", "Kwaliweni", "Ludlawini", "Meleti", "Mgundundlovu", "Mvuma", "Ndzingeni", "Nkamanzi", "Ntsanjeni"]
                },
                {
                    name: "Nkhaba",
                    cities: ["Ejubukweni", "Ekujinjelweni", "Malanti", "Nkhaba"]
                },
                {
                    name: "Ntfonjeni",
                    cities: ["Emvembili", "Hhelehhele", "KaNdwandwa", "Ka_Hhohho", "Lomshiyo", "Mshingishingini", "Vusweni"]
                },
                {
                    name: "Madlangempisi",
                    cities: ["Dvokolwako_Ekuphakameni", "Ekukhulumeni_Mzaceni", "Gucuka", "Mavula", "Nyonyane_Maguga", "Tfuntini_Buhlebuyeza", "Zandondo"]
                },
                {
                    name: "Piggs_Peak",
                    cities: ["Bulembu_Luhhumaneni_1", "Luhhumaneni_Kandeva", "Luhlangotsini", "Nginamadvolo", "Nsangwini", "Piggs_Peak"]
                },
                {
                    name: "Siphocosini",
                    cities: ["Luhlendlweni", "Mantabeni", "Sigangeni", "Siphocosini"]
                },
                {
                    name: "Timphisini",
                    cities: ["Hhohho", "Ludzibini", "Mashobeni_North", "Mvembili"]
                },
            ]
        },
        {
            name: "Manzini",
            states: [
                {
                    name: "Kukhanyeni",
                    cities: ["Bhekinkosi", "Maliyaduma", "Mbeka", "Mkhulamini", "Nkiliji", "Nswaceni", "Nyakeni"]
                },
                {
                    name: "Kwaluseni",
                    cities: ["Kwaluseni", "Logoba", "Mhlane"]
                },
                {
                    name: "Lamgabhi",
                    cities: ["Dvudvusini", "Emhlangeni", "LaMgabhi", "Luhleko", "Nhlulweni"]
                },
                {
                    name: "Lobamba_Lomdzala",
                    cities: ["Engweyameni", "Kufinyeni", "Luyengo", "Mahlanya"]
                },
                {
                    name: "Ludzeludze",
                    cities: ["Kudzeni", "Lozitha", "Mbekelweni", "Nkamanzi", "Zombodze"]
                },
                {
                    name: "Mafutseni",
                    cities: ["Bhudla", "Ka_Nkambule", "Luhlokohla", "Mafutseni", "Ngculwini", "Timbutini"]
                },
                {
                    name: "Mahlangatsha",
                    cities: ["Bhahwini", "KaZulu", "Ludvodvolweni", "Luzelweni", "Mahlangatsha", "Mambatfweni", "Mgofelweni", "Nciniselweni", "Ndzeleni", "Nsangwini", "Sigcineni"]
                },
                {
                    name: "Mangcongco",
                    cities: ["Dwalile", "Mabhukwini", "Mangcongco_Zenukeni", "Sandlane_Ekuthuleni"]
                },
                {
                    name: "Manzini_North",
                    cities: ["Dvwaleni", "Makholweni", "Manzini_Central", "Mnyenyweni", "Mzimnene", "St_Pauls"]
                },
                {
                    name: "Manzini_South",
                    cities: ["Mhobodleni", "Mjingo", "Moneni", "Ngwane_Park", "Ticancweni", "Zakhele"]
                },
                {
                    name: "Mhlambanyatsi",
                    cities: ["Bhunya", "Dingizwe", "Lundzi", "Mbangave", "Mlindazwe", "Zondwako"]
                },
                {
                    name: "Mkhiweni",
                    cities: ["Dvokolwako", "Ekutsimleni", "Khuphuka", "Mbelebeleni", "Mnjoli_Likima"]
                },
                {
                    name: "Mtfongwaneni",
                    cities: ["Gundvwini", "Hlane_Bulunga", "Lwandle", "Ndlandlameni"]
                },
                {
                    name: "Ngwempisi",
                    cities: ["Bhadzeni_1", "Dladleni", "Macundvulwini", "Ngcoseni", "Velezizweni"]
                },
                {
                    name: "Nhlambeni",
                    cities: ["Masundvwini", "Mphankhomo", "Ngonini", "Njelu"]
                },
                {
                    name: "Nkomiyahlaba",
                    cities: ["Eni", "Ngcayini", "Nsenga", "Nsingweni", "Ntunja", "Sankolweni", "Sibuyeni", "Sigombeni", "Vusweni"]
                },
                {
                    name: "Ntontozi",
                    cities: ["Gebeni", "Khalangilile", "Mphini", "Ncabaneni", "Ndinda", "Ndlinilembi", "Ntondozi"]
                },
                {
                    name: "Phondo",
                    cities: ["Bhadzeni_2", "Khabonina", "Lushikishini", "Mahhashini", "Mgazini"]
                }
            ]
        },
        {
            name: "Lubombo",
            states: [
                {
                    name: "Dvokodvweni",
                    cities: ["Hlane", "Malindza", "Mdumezulu", "Mhlangatane", "Njabulweni", "Ntandweni"]
                },
                {
                    name: "Gilgal",
                    cities: ["Bulunga", "Etjedze", "Hlutse", "Mabondvweni", "Macetjeni", "Sigcaweni", "Vikizijula"]
                },
                {
                    name: "Lomahasha",
                    cities: ["Lomahasha", "Shewula"]
                },
                {
                    name: "Lubulini",
                    cities: ["KaVuma", "Mabantaneni", "Nsoko", "Ntuthwakazi"]
                },
                {
                    name: "Lugongolweni",
                    cities: ["KaLanga", "Makhewu", "Mlindazwe", "Sitsatsaweni"]
                },
                {
                    name: "Matsanjeni_North",
                    cities: ["Lukhetseni", "Mambane", "Maphungwane", "Tikhuba"]
                },
                {
                    name: "Mhlume",
                    cities: ["Mafucula", "Mhlume", "Simunye", "Tambankulu", "Tsambokhulu", "Tshaneni", "Vuvulane"]
                },
                {
                    name: "Mpolonjeni",
                    cities: ["KaShoba", "Mpolonjeni", "Ndzangu", "Ngcina", "Sigcaweni_East"]
                },
                {
                    name: "Nkilongo",
                    cities: ["Crooks_Plantations", "Gamula", "Illovo_Mayaluka", "Lunkuntfu", "Nkhanini_Lusabeni", "Phafeni"]
                },
                {
                    name: "Siphofaneni",
                    cities: ["KaMkhweli", "Madlenya", "Maphilingo", "Mphumakudze", "Nceka", "Ngevini", "Tambuti"]
                },
                {
                    name: "Sithobela",
                    cities: ["Luhlanyeni", "Mamisa", "Nkonjwa", "Nokwane"]
                }
            ]
        },
        {
            name: "Shiselweni",
            states: [
                {
                    name: "Gege",
                    cities: ["Dilini", "KaDinga", "KaTsambekwako", "Mashobeni_South", "Mhlahlweni", "Mlindazwe", "Nshamanti", "Nsukazi", "Sidwala", "Sisingeni", "Siyendle"]
                },
                {
                    name: "Hosea",
                    cities: ["Bufaneni", "Hhohho_Emuva", "KaLiba", "Lushini", "Manyiseni", "Nsingizini", "Ondiyaneni"]
                },
                {
                    name: "KuMethula",
                    cities: ["Gasa", "Khamsile", "Lomfa", "Mbabane", "Mbangweni", "Nkalaneni", "Nkomonye", "Nzameya"]
                },
                {
                    name: "Kubuta",
                    cities: ["Ezishineni", "KaGwebu", "KaKholwane", "KaMbhoke", "KaPhunga", "Manyeveni", "Ngobelweni", "Nhlalabantfu"]
                },
                {
                    name: "Maseyisini",
                    cities: ["Dlovunga", "KaMzizi", "Masibini", "Mbilaneni", "Simemeni", "Vusweni"]
                },
                {
                    name: "Matsanjeni_South",
                    cities: ["Bambitje", "Dinabanye", "Kwaluseni", "Nkonka", "Nsalitje", "Qomintaba"]
                },
                {
                    name: "Mtsambama",
                    cities: ["Bhanganoma", "Ebenezer", "KaZenzile", "Kwendzeni", "Magele"]
                },
                {
                    name: "Ngudzeni",
                    cities: ["KaMhawu", "KaMkhaya", "KaMshengu", "Lusitini", "Mphini", "Ndushulweni", "Nokwane", "Phobane"]
                },
                {
                    name: "Nkwene",
                    cities: ["Buseleni", "Ekuphumleni", "Hlobane", "Nkwene"]
                },
                {
                    name: "Sandleni",
                    cities: ["Ezibondeni_KaShiba", "KaGwegwe", "Ngololweni", "Nhletjeni", "Nkhungwini"]
                },
                {
                    name: "Shiselweni_1",
                    cities: ["Dumenkungwini", "Eposini", "Hhuhhuma", "Mabonabulawe", "Manyandzeni", "Mchinsweni", "Zikhotheni"]
                },
                {
                    name: "Shiselweni_2",
                    cities: ["Mahlalini", "Makhwelela", "Mathendele", "Mbabala", "Mbangweni", "Mbeka", "Mkhitsini", "Mpangisweni", "Sikhotseni"]
                },
                {
                    name: "Sigwe",
                    cities: ["Kuphumleni_Enjabulweni", "Lulakeni", "Ndunayithini", "Nyatsini"]
                },
                {
                    name: "Somntongo",
                    cities: ["Etjeni", "Luhlekweni", "Maplotini", "Nsubane", "Ntuthwakazi", "Phangweni", "Vimbizibuko"]
                },
                {
                    name: "Zombodze_Emuva",
                    cities: ["Bulekeni", "Mampondweni", "Ngwenyameni", "Zombodze"]
                }
                // Add more states and cities for the United States as needed...
            ]
        }
    ];



    // Generate dropdown options based on the selected values and data structure
    const countries = countriesData.map((country) => (
        <option key={country.name} value={country.name}>
            {country.name}
        </option>
    ));

    const states = countriesData
        .find((item) => item.name === country)
        ?.states.map((state) => (
            <option key={state.name} value={state.name}>
                {state.name}
            </option>
        ));

    const cities = countriesData
        .find((item) => item.name === country)
        ?.states.find((item) => item.name === state)
        ?.cities.map((city) => (
            <option key={city} value={city}>
                {city}
            </option>
        ));


    const searchableOptions = [
        { value: 'Dlangeni Primary School', label: 'Dlangeni Primary School' },
        { value: 'Mbuluzi High School', label: 'Mbuluzi High School' },
        { value: 'Nsukumbili High School', label: 'Nsukumbili High School' },
        { value: 'Ntsintsa Red Cross', label: 'Ntsintsa Red Cross' },
        { value: 'Emphakatsi', label: 'Emphakatsi' },
        { value: 'KaSiko Primary School', label: 'KaSiko Primary School' },
        { value: 'Hlobane Primary School', label: 'Hlobane Primary School' },
        { value: 'LaMgabhi Primary School', label: 'LaMgabhi Primary School' },
        { value: 'World Vision', label: 'World Vision' },
        { value: 'Community Hall', label: 'Community Hall' },
        { value: 'Mlindazwe Primary School', label: 'Mlindazwe Primary School' },
        { value: 'Ezulwini Community School', label: 'Ezulwini Community School' },
        { value: 'Ezulwini RC School', label: 'Ezulwini RC School' },
        { value: 'Somnjalose High School', label: 'Somnjalose High School' },
        { value: 'Valley Primary School', label: 'Valley Primary School' },
        { value: 'Lobamba High School', label: 'Lobamba High School' },
        { value: 'Community Hall', label: 'Community Hall' },
        { value: 'Ekuzukekeni Gogo Centre', label: 'Ekuzukekeni Gogo Centre' },
        { value: 'Emtjodvweni Edladleni', label: 'Emtjodvweni Edladleni' },
        { value: 'Sitjeni Primary School', label: 'Sitjeni Primary School' },
        { value: 'Dvokolwako High School', label: 'Dvokolwako High School' },
        { value: 'Madlangempisi High School', label: 'Madlangempisi High School' },
        { value: 'Mzaceni Primary School', label: 'Mzaceni Primary School' },
        { value: 'Mavula Primary School', label: 'Mavula Primary School' },
        { value: 'Maguga High School', label: 'Maguga High School' },
        { value: 'Buhlebuyeza Primary School', label: 'Buhlebuyeza Primary School' },
        { value: 'Manzana Nazarene Primary School', label: 'Manzana Nazarene Primary School' },
        { value: 'Nkambeni Primary School', label: 'Nkambeni Primary School' },
        { value: 'Zwide Primary School', label: 'Zwide Primary School' },
        { value: 'Evangelical Church', label: 'Evangelical Church' },
        { value: 'Zandondo Primary School', label: 'Zandondo Primary School' },
        { value: 'Ararati Primary School', label: 'Ararati Primary School' },
        { value: 'KaMadlolo Emphakatsi', label: 'KaMadlolo Emphakatsi' },
        { value: 'Machegwini School', label: 'Machegwini School' },
        { value: 'Maphalaleni Primary School', label: 'Maphalaleni Primary School' },
        { value: 'Mcengeni NCP', label: 'Mcengeni NCP' },
        { value: 'Nsingweni Clinic', label: 'Nsingweni Clinic' },
        { value: 'Nsingweni Old Inkhundla', label: 'Nsingweni Old Inkhundla' },
        { value: 'Sobandla School', label: 'Sobandla School' },
        { value: 'Fontotje High School', label: 'Fontotje High School' },
        { value: 'Hereford’s High School', label: 'Hereford’s High School' },
        { value: 'Matfuntini High School', label: 'Matfuntini High School' },
        { value: 'Holiness Church', label: 'Holiness Church' },
        { value: 'Mayiwane High School', label: 'Mayiwane High School' },
        { value: 'Mkhuzweni Primary School', label: 'Mkhuzweni Primary School' },
        { value: 'Apostle Church', label: 'Apostle Church' },
        { value: 'Fonteyn High School', label: 'Fonteyn High School' },
        { value: 'Fonteyn Pre-School', label: 'Fonteyn Pre-School' },
        { value: 'St Mark’s High School', label: 'St Mark’s High School' },
        { value: 'Mbuluzi Primary School', label: 'Mbuluzi Primary School' },
        { value: 'Zamani Primary School', label: 'Zamani Primary School' },
        { value: 'KaBoyce School', label: 'KaBoyce School' },
        { value: 'Mqolo Primary School', label: 'Mqolo Primary School' },
        { value: 'Msunduza Hall', label: 'Msunduza Hall' },
        { value: 'Limkokwing University', label: 'Limkokwing University' },
        { value: 'Makholokholo Centre', label: 'Makholokholo Centre' },
        { value: 'Sebenta Centre', label: 'Sebenta Centre' },
        { value: 'Woodlands School', label: 'Woodlands School' },
        { value: 'Bahai School', label: 'Bahai School' },
        { value: 'Mangwaneni NCP', label: 'Mangwaneni NCP' },
        { value: 'Mangwaneni Primary School', label: 'Mangwaneni Primary School' },
        { value: 'Mbabane Central High School', label: 'Mbabane Central High School' },
        { value: 'Africa Continental Mission', label: 'Africa Continental Mission' },
        { value: 'AMICAAL Centre', label: 'AMICAAL Centre' },
        { value: 'Nkwalini Primary School', label: 'Nkwalini Primary School' },
        { value: 'Red Cross', label: 'Red Cross' },
        { value: 'Sikhondze Church', label: 'Sikhondze Church' },
        { value: 'Egushede', label: 'Egushede' },
        { value: 'Mangweni High School', label: 'Mangweni High School' },
        { value: 'Ekujabuleni School', label: 'Ekujabuleni School' },
        { value: 'Mdlawini Primary School', label: 'Mdlawini Primary School' },
        { value: 'Mhlangatane Nazarene Primary School', label: 'Mhlangatane Nazarene Primary School' },
        { value: 'Nhlanguyavuka Primary School', label: 'Nhlanguyavuka Primary School' },
        { value: 'Zinyane Primary School', label: 'Zinyane Primary School' },
        { value: 'Londunduma High School', label: 'Londunduma High School' },
        { value: 'Ngwenya Village Hall', label: 'Ngwenya Village Hall' },
        { value: 'Mpolonjeni NCP', label: 'Mpolonjeni NCP' },
        { value: 'Mpolonjeni Roman Community', label: 'Mpolonjeni Roman Community' },
        { value: 'New Life Private School', label: 'New Life Private School' },
        { value: 'Motshane High School', label: 'Motshane High School' },
        { value: 'Bulandzeni Community School', label: 'Bulandzeni Community School' },
        { value: 'Bulandzeni Primary School', label: 'Bulandzeni Primary School' },
        { value: 'Mgululu Primary School', label: 'Mgululu Primary School' },
        { value: 'Enkonyeni High School', label: 'Enkonyeni High School' },
        { value: 'Mphondla Primary School', label: 'Mphondla Primary School' },
        { value: 'Mpumalanga Primary School', label: 'Mpumalanga Primary School' },
        { value: 'Nazarene Church', label: 'Nazarene Church' },
        { value: 'Mvuma Primary School', label: 'Mvuma Primary School' },
        { value: 'KaLanyandza Primary School', label: 'KaLanyandza Primary School' },
        { value: 'Ndzingeni Nazarene Primary School', label: 'Ndzingeni Nazarene Primary School' },
        { value: 'Geza Primary School', label: 'Geza Primary School' },
        { value: 'Nkamanzi Primary School', label: 'Nkamanzi Primary School' },
        { value: 'Ejubukweni Primary School', label: 'Ejubukweni Primary School' },
        { value: 'Nazarene church', label: 'Nazarene church' },
        { value: 'Malandzela Primary School', label: 'Malandzela Primary School' },
        { value: 'Mnyokane Primary School', label: 'Mnyokane Primary School' },
        { value: 'St Pauls', label: 'St Pauls' },
        { value: 'Malanti Primary School', label: 'Malanti Primary School' },
        { value: 'Hawane Primary School', label: 'Hawane Primary School' },
        { value: 'Nkhaba High School', label: 'Nkhaba High School' },
        { value: 'Hhohho AME School', label: 'Hhohho AME School' },
        { value: 'Hhelehhele Nazarene Primary School', label: 'Hhelehhele Nazarene Primary School' },
        { value: 'Lufafa Primary School', label: 'Lufafa Primary School' },
        { value: 'Ezibonele Pre-School', label: 'Ezibonele Pre-School' },
        { value: 'Umphakatsi', label: 'Umphakatsi' },
        { value: 'Ntfonjeni Primary School', label: 'Ntfonjeni Primary School' },
        { value: 'Lutheran Primary School', label: 'Lutheran Primary School' },
        { value: 'Mshingishingini Emphakatsi', label: 'Mshingishingini Emphakatsi' },
        { value: 'Mshingishingini Primary School', label: 'Mshingishingini Primary School' },
        { value: 'Ekudvwaleni School', label: 'Ekudvwaleni School' },
        { value: 'Vusweni Nazarene Primary School', label: 'Vusweni Nazarene Primary School' },
        { value: 'Malanda Hall', label: 'Malanda Hall' },
        { value: 'Luhhumaneni Primary School', label: 'Luhhumaneni Primary School' },
        { value: 'Lutheran Primary School', label: 'Lutheran Primary School' },
        { value: 'Maguga Clinic', label: 'Maguga Clinic' },
        { value: 'St Amedius School', label: 'St Amedius School' },
        { value: 'Kukhanyeni Church', label: 'Kukhanyeni Church' },
        { value: 'Nginamandvolo Primary School', label: 'Nginamandvolo Primary School' },
        { value: 'Magobodvo High School', label: 'Magobodvo High School' },
        { value: 'Nsangwini High School', label: 'Nsangwini High School' },
        { value: 'Magistrate Court', label: 'Magistrate Court' },
        { value: 'Maryward Primary School', label: 'Maryward Primary School' },
        { value: 'Bhekephi Primary School', label: 'Bhekephi Primary School' },
        { value: 'Sigangeni High School', label: 'Sigangeni High School' },
        { value: 'All Saints Primary School', label: 'All Saints Primary School' },
        { value: 'Hlabazonkhe Primary School', label: 'Hlabazonkhe Primary School' },
        { value: 'Masibekela High School', label: 'Masibekela High School' },
        { value: 'Siphocosini High School', label: 'Siphocosini High School' },
        { value: 'Ndlalambi Primary School', label: 'Ndlalambi Primary School' },
        { value: 'Ludzibini High School', label: 'Ludzibini High School' },

        //////// SHISELWENI
        { value: 'Gogo Centre', label: 'Gogo Centre' },
        { value: 'Magojela Primary School', label: 'Magojela Primary School' },
        { value: 'Mbita Primary School', label: 'Mbita Primary School' },
        { value: 'KaDinga Primary School', label: 'KaDinga Primary School' },
        { value: 'Apostolic Faith Church', label: 'Apostolic Faith Church' },
        { value: 'Mashobeni Methodist Primary School', label: 'Mashobeni Methodist Primary School' },
        { value: 'Mshengu High School', label: 'Mshengu High School' },
        { value: 'Vulamehlo School', label: 'Vulamehlo School' },
        { value: 'Eric Rosenburg School', label: 'Eric Rosenburg School' },
        { value: 'Magojela High School', label: 'Magojela High School' },
        { value: 'Magubheleni Primary School', label: 'Magubheleni Primary School' },
        { value: 'Mahhusha NCP', label: 'Mahhusha NCP' },
        { value: 'Dudusini Primary School', label: 'Dudusini Primary School' },
        { value: 'Siyendle Community Primary School', label: 'Siyendle Community Primary School' },
        { value: 'Ngozi Primary School', label: 'Ngozi Primary School' },
        { value: 'Hosea Primary School', label: 'Hosea Primary School' },
        { value: 'Bhejisa Primary School', label: 'Bhejisa Primary School' },
        { value: 'Hluthi Central High School', label: 'Hluthi Central High School' },
        { value: 'Nsingizini Primary School', label: 'Nsingizini Primary School' },
        { value: 'Dlume Primary School', label: 'Dlume Primary School' },
        { value: 'Ekuphakameni High School', label: 'Ekuphakameni High School' },
        { value: 'Gogo Center', label: 'Gogo Center' },
        { value: 'Kakholwane Primary School', label: 'Kakholwane Primary School' },
        { value: 'Nayini Primary School', label: 'Nayini Primary School' },
        { value: 'KaMboke High School', label: 'KaMboke High School' },
        { value: "St. Anthony's Primary School", label: "St. Anthony's Primary School" },
        { value: 'Dvumbe Primary School', label: 'Dvumbe Primary School' },
        { value: 'KaPhunga High School', label: 'KaPhunga High School' },
        { value: 'Matjana Primary School', label: 'Matjana Primary School' },
        { value: 'Mbosi Primary School', label: 'Mbosi Primary School' },
        { value: 'World Vision Hall - Emphakatsi', label: 'World Vision Hall - Emphakatsi' },
        { value: 'KaLaMdladla Primary School', label: 'KaLaMdladla Primary School' },
        { value: 'Dzakasini Primary School', label: 'Dzakasini Primary School' },
        { value: 'Baptist Church', label: 'Baptist Church' },
        { value: 'Velebantfu High School', label: 'Velebantfu High School' },
        { value: 'Hhohho Primary School', label: 'Hhohho Primary School' },
        { value: 'Ekuthandaneni Church', label: 'Ekuthandaneni Church' },
        { value: 'Phongolwane Primary School', label: 'Phongolwane Primary School' },
        { value: 'Mzila Primary School', label: 'Mzila Primary School' },
        { value: 'Mbukwane School', label: 'Mbukwane School' },
        { value: 'Mlambo High School', label: 'Mlambo High School' },
        { value: 'Mlambo Primary School', label: 'Mlambo Primary School' },
        { value: 'Nzongomane Primary School', label: 'Nzongomane Primary School' },
        { value: 'Tfokotani Primary School', label: 'Tfokotani Primary School' },
        { value: 'Makhonza Primary School', label: 'Makhonza Primary School' },
        { value: 'Makhosini Primary School', label: 'Makhosini Primary School' },
        { value: 'Nkoneni Primary School', label: 'Nkoneni Primary School' },
        { value: 'Nyamane Primary School', label: 'Nyamane Primary School' },
        { value: 'Simemeni Pre-School', label: 'Simemeni Pre-School' },
        { value: 'Joppa Primary School', label: 'Joppa Primary School' },
        { value: 'Bambitje Primary School', label: 'Bambitje Primary School' },
        { value: 'Phumelela Primary School', label: 'Phumelela Primary School' },
        { value: 'Hlushwana Primary School', label: 'Hlushwana Primary School' },
        { value: 'Oslo High School', label: 'Oslo High School' },
        { value: 'Matsanjeni Primary School', label: 'Matsanjeni Primary School' },
        { value: 'No.1 Primary School', label: 'No.1 Primary School' },
        { value: 'Nkuntjini Primary School', label: 'Nkuntjini Primary School' },
        { value: 'Osabeni Primary School', label: 'Osabeni Primary School' },
        { value: 'Qomintaba Primary School', label: 'Qomintaba Primary School' },
        { value: 'Mavukutfu Primary School', label: 'Mavukutfu Primary School' },
        { value: 'Ebenezer High School', label: 'Ebenezer High School' },
        { value: 'Hlathikhulu Central High School', label: 'Hlathikhulu Central High School' },
        { value: 'Mpatheni Primary School', label: 'Mpatheni Primary School' },
        { value: 'KaZenzile NCP', label: 'KaZenzile NCP' },
        { value: 'Salem High School', label: 'Salem High School' },
        { value: 'New Warm Primary School', label: 'New Warm Primary School' },
        { value: 'Ntjanini Primary School', label: 'Ntjanini Primary School' },
        { value: 'Mahhosha Primary School', label: 'Mahhosha Primary School' },
        { value: 'Ngudzeni High School', label: 'Ngudzeni High School' },
        { value: 'Lusitini NCP', label: 'Lusitini NCP' },
        { value: 'Mphini NCP', label: 'Mphini NCP' },
        { value: 'Ngudzeni Primary School', label: 'Ngudzeni Primary School' },
        { value: 'Lomvovo Church', label: 'Lomvovo Church' },
        { value: 'Mandvulo Primary School', label: 'Mandvulo Primary School' },
        { value: 'Mkhondvo High School', label: 'Mkhondvo High School' },
        { value: 'Nzeleni Primary School', label: 'Nzeleni Primary School' },
        { value: 'Tholulwazi Primary School', label: 'Tholulwazi Primary School' },
        { value: 'Ekuphumleni Primary School', label: 'Ekuphumleni Primary School' },
        { value: 'Tholulwazi Primary School', label: 'Tholulwazi Primary School' },
        { value: 'Ekujabuleni Primary School', label: 'Ekujabuleni Primary School' },
        { value: 'Kontjingila Primary School', label: 'Kontjingila Primary School' },
        { value: 'Mbowane Primary School', label: 'Mbowane Primary School' },
        { value: 'Sandleni Primary School', label: 'Sandleni Primary School' },
        { value: 'Ngololweni Primary School', label: 'Ngololweni Primary School' },
        { value: 'Nhletjeni Primary School', label: 'Nhletjeni Primary School' },
        { value: 'Nkhungwini Primary School', label: 'Nkhungwini Primary School' },
        { value: 'Welcome Primary School', label: 'Welcome Primary School' },
        { value: 'St. Juliana Primary School', label: 'St. Juliana Primary School' },
        { value: 'Evangelical Church', label: 'Evangelical Church' },
        { value: 'Masiphula Primary School', label: 'Masiphula Primary School' },
        { value: 'Mantambe Primary School', label: 'Mantambe Primary School' },
        { value: 'Mantambe High School', label: 'Mantambe High School' },
        { value: 'St. Anslem Primary School', label: 'St. Anslem Primary School' },
        { value: 'Dvwaleni High School', label: 'Dvwaleni High School' },
        { value: 'Madulini Primary School', label: 'Madulini Primary School' },
        { value: 'Sibovu Primary School', label: 'Sibovu Primary School' },
        { value: 'Doropeni Primary School', label: 'Doropeni Primary School' },
        { value: 'Mathendele Hall', label: 'Mathendele Hall' },
        { value: 'RDA Structure', label: 'RDA Structure' },
        { value: 'Nsongweni High School', label: 'Nsongweni High School' },
        { value: 'Galile Primary School', label: 'Galile Primary School' },
        { value: 'Sokhonjiwe Primary School', label: 'Sokhonjiwe Primary School' },
        { value: 'Alliance Church', label: 'Alliance Church' },
        { value: 'Makhava Primary School', label: 'Makhava Primary School' },
        { value: 'Mpakeni Primary School', label: 'Mpakeni Primary School' },
        { value: 'KaMngayi NCP', label: 'KaMngayi NCP' },
        { value: 'Lulakeni Primary School', label: 'Lulakeni Primary School' },
        { value: 'Mbava Primary School', label: 'Mbava Primary School' },
        { value: 'Sigwe Inkhundla', label: 'Sigwe Inkhundla' },
        { value: 'Langolotjeni Primary School', label: 'Langolotjeni Primary School' },
        { value: 'Ndunayithini High School', label: 'Ndunayithini High School' },
        { value: 'Nyatsini Primary School', label: 'Nyatsini Primary School' },
        { value: 'Etjeni Primary School', label: 'Etjeni Primary School' },
        { value: 'Ezindwendweni Secondary School', label: 'Ezindwendweni Secondary School' },
        { value: 'Thesalonika Church', label: 'Thesalonika Church' },
        { value: 'Lavumisa Primary', label: 'Lavumisa Primary' },
        { value: 'Nsubane Primary school', label: 'Nsubane Primary school' },
        { value: 'Apostolic Faith Church', label: 'Apostolic Faith Church' },
        { value: 'Health Post', label: 'Health Post' },
        { value: 'Mlindazwe Primary School', label: 'Mlindazwe Primary School' },
        { value: 'Emthonjeni', label: 'Emthonjeni' },
        { value: 'Mgampondo Primary School', label: 'Mgampondo Primary School' },
        { value: 'Ekuthuleni High School', label: 'Ekuthuleni High School' },
        { value: 'Othandweni Primary School', label: 'Othandweni Primary School' },
        { value: 'Nkulunga Primary School', label: 'Nkulunga Primary School' },
        { value: 'Ngwane Primary School', label: 'Ngwane Primary School' },

        /////LUBOMBO
        { value: 'Dlalisile High School', label: 'Dlalisile High School' },
        { value: 'Malindza High School', label: 'Malindza High School' },
        { value: 'Mbadlane World Vision', label: 'Mbadlane World Vision' },
        { value: 'Mpaka High School', label: 'Mpaka High School' },
        { value: 'Nsulutane Primary School', label: 'Nsulutane Primary School' },
        { value: 'Community Hall', label: 'Community Hall' },
        { value: 'New Thulwane Primary School', label: 'New Thulwane Primary School' },
        { value: 'Dvokodvweni Primary School', label: 'Dvokodvweni Primary School' },
        { value: 'Njabulweni Primary School', label: 'Njabulweni Primary School' },
        { value: 'Ntandweni Primary School', label: 'Ntandweni Primary School' },
        { value: 'Siweni Primary School', label: 'Siweni Primary School' },
        { value: 'Nazarene Church', label: 'Nazarene Church' },
        { value: 'Khuzwayo Primary School', label: 'Khuzwayo Primary School' },
        { value: 'Hlutse High School', label: 'Hlutse High School' },
        { value: 'Sikhandzabantfu Primary School', label: 'Sikhandzabantfu Primary School' },
        { value: 'Mabondvweni Primary School', label: 'Mabondvweni Primary School' },
        { value: 'Gilgal Primary School', label: 'Gilgal Primary School' },
        { value: 'Sigcaweni Primary School', label: 'Sigcaweni Primary School' },
        { value: 'Duze High School', label: 'Duze High School' },
        { value: 'Phonjwane High School', label: 'Phonjwane High School' },
        { value: 'Lomahasha Central High', label: 'Lomahasha Central High' },
        { value: 'Mafusini School', label: 'Mafusini School' },
        { value: 'Mbokojweni Primary School', label: 'Mbokojweni Primary School' },
        { value: 'Nkalashane School', label: 'Nkalashane School' },
        { value: 'Majembeni Primary School', label: 'Majembeni Primary School' },
        { value: 'Mbandzamane Primary School', label: 'Mbandzamane Primary School' },
        { value: 'Shewula Primary School', label: 'Shewula Primary School' },
        { value: 'SOS Nazarene', label: 'SOS Nazarene' },
        { value: 'KaVuma Primary School', label: 'KaVuma Primary School' },
        { value: 'Dlakadla Primary School', label: 'Dlakadla Primary School' },
        { value: 'Lubuli High School', label: 'Lubuli High School' },
        { value: 'Mbutfu High school', label: 'Mbutfu High school' },
        { value: 'Ndzevane Primary School', label: 'Ndzevane Primary School' },
        { value: 'Canterbury Hall', label: 'Canterbury Hall' },
        { value: 'Maja Primary School', label: 'Maja Primary School' },
        { value: 'Ntuthwakazi Primary School', label: 'Ntuthwakazi Primary School' },
        { value: 'Emphakatsi', label: 'Emphakatsi' },
        { value: 'KaLanga etitolo (Pre-School)', label: 'KaLanga etitolo (Pre-School)' },
        { value: 'Matsetsa Nazarene School', label: 'Matsetsa Nazarene School' },
        { value: 'Nyambo Primary School', label: 'Nyambo Primary School' },
        { value: 'Purity High School', label: 'Purity High School' },
        { value: 'Good Shepherd Primary School', label: 'Good Shepherd Primary School' },
        { value: 'Mhlumeni Nazarene', label: 'Mhlumeni Nazarene' },
        { value: 'Mlindazwe Primary School', label: 'Mlindazwe Primary School' },
        { value: 'St Boniface Primary School', label: 'St Boniface Primary School' },
        { value: 'Sitsatsaweni Primary School', label: 'Sitsatsaweni Primary School' },
        { value: 'Mavalela Primary School', label: 'Mavalela Primary School' },
        { value: 'Mnyafula Primary School', label: 'Mnyafula Primary School' },
        { value: 'Lucaceni Primary School', label: 'Lucaceni Primary School' },
        { value: 'Mambane Primary School', label: 'Mambane Primary School' },
        { value: 'Dvumane Primary School', label: 'Dvumane Primary School' },
        { value: 'KaNtuli shops - playground', label: 'KaNtuli shops - playground' },
        { value: 'Loyiwe Primary School', label: 'Loyiwe Primary School' },
        { value: 'Mpundle High School', label: 'Mpundle High School' },
        { value: 'St John’s Primary School', label: 'St John’s Primary School' },
        { value: 'Tikhuba High School', label: 'Tikhuba High School' },
        { value: 'Ekuhlamukeni Pre-School', label: 'Ekuhlamukeni Pre-School' },
        { value: 'Mafucula Primary School', label: 'Mafucula Primary School' },
        { value: 'Maphiveni NCP', label: 'Maphiveni NCP' },
        { value: 'Mhlume Hall', label: 'Mhlume Hall' },
        { value: 'Ngomane Hall', label: 'Ngomane Hall' },
        { value: 'Simunye Hall', label: 'Simunye Hall' },
        { value: 'Tabankulu Hall', label: 'Tabankulu Hall' },
        { value: 'Tsambonkulu Primary School', label: 'Tsambonkulu Primary School' },
        { value: 'Tshaneni Hall', label: 'Tshaneni Hall' },
        { value: 'Vuvulane Hall', label: 'Vuvulane Hall' },
        { value: 'Nhlabeni Primary School', label: 'Nhlabeni Primary School' },
        { value: 'Mncitsini lidladla NCP', label: 'Mncitsini lidladla NCP' },
        { value: 'Siphoso Primary School', label: 'Siphoso Primary School' },
        { value: 'St Augustine Primary School', label: 'St Augustine Primary School' },
        { value: 'Ndzangu Lutheran Primary School', label: 'Ndzangu Lutheran Primary School' },
        { value: 'Ngcina Primary School', label: 'Ngcina Primary School' },
        { value: 'Community Hall - Emphakatsi', label: 'Community Hall - Emphakatsi' },
        { value: 'Crook’s Hall', label: 'Crook’s Hall' },
        { value: 'Community Hall', label: 'Community Hall' },
        { value: 'Emajombe Primary School', label: 'Emajombe Primary School' },
        { value: 'Mayaluka Hall', label: 'Mayaluka Hall' },
        { value: 'Community Hall - Emphakatsi', label: 'Community Hall - Emphakatsi' },
        { value: 'Nkhanini Primary School', label: 'Nkhanini Primary School' },
        { value: 'Big- Bend High School', label: 'Big- Bend High School' },
        { value: 'Mahlabaneni Primary School', label: 'Mahlabaneni Primary School' },
        { value: 'Emnotfweni Primary School', label: 'Emnotfweni Primary School' },
        { value: 'KaMkhweli Primary School', label: 'KaMkhweli Primary School' },
        { value: 'Siphofaneni High School', label: 'Siphofaneni High School' },
        { value: 'Madlenya Primary School', label: 'Madlenya Primary School' },
        { value: 'Siphofaneni Primary School', label: 'Siphofaneni Primary School' },
        { value: 'Othandweni Primary School', label: 'Othandweni Primary School' },
        { value: 'Mphaphati Primary School', label: 'Mphaphati Primary School' },
        { value: 'Mphumakudze Primary School', label: 'Mphumakudze Primary School' },
        { value: 'Sinceni Mission Primary School', label: 'Sinceni Mission Primary School' },
        { value: 'Mahlabatsini Primary School', label: 'Mahlabatsini Primary School' },
        { value: 'Manyovu Primary School', label: 'Manyovu Primary School' },
        { value: 'Sibetsaphi Primary School', label: 'Sibetsaphi Primary School' },
        { value: 'Tambuti Primary School', label: 'Tambuti Primary School' },
        { value: 'Evangelical Church', label: 'Evangelical Church' },
        { value: 'Lavundlamanti High School', label: 'Lavundlamanti High School' },
        { value: 'Luhlanyeni Primary School', label: 'Luhlanyeni Primary School' },
        { value: 'Themba Primary School', label: 'Themba Primary School' },
        { value: 'Lomphala Primary School', label: 'Lomphala Primary School' },
        { value: 'Mamisa Primary School', label: 'Mamisa Primary School' },
        { value: 'St Loretta Primary School', label: 'St Loretta Primary School' },
        { value: 'Lamagengane Primary School', label: 'Lamagengane Primary School' },
        { value: 'Mabhensane Primary School', label: 'Mabhensane Primary School' },
        { value: 'Makhwekhweti Primary School', label: 'Makhwekhweti Primary School' },
        { value: 'Maloyi Primary School', label: 'Maloyi Primary School' },
        { value: 'Nkonjwa Primary School', label: 'Nkonjwa Primary School' },
        { value: 'Emphelandzaba High School', label: 'Emphelandzaba High School' },
        { value: 'Letindze Primary School', label: 'Letindze Primary School' },

        // MANZINI
        { value: 'Bhekinkhosi Holy Church', label: 'Bhekinkhosi Holy Church' },
        { value: 'Maliyaduma Primary School', label: 'Maliyaduma Primary School' },
        { value: 'Mbeka NCP/ Pre-School', label: 'Mbeka NCP/ Pre-School' },
        { value: 'Mphembekati Primary School', label: 'Mphembekati Primary School' },
        { value: 'Matete Goods-shed', label: 'Matete Goods-shed' },
        { value: 'Nkiliji Primary School', label: 'Nkiliji Primary School' },
        { value: 'Ekukhanyeni Primary School', label: 'Ekukhanyeni Primary School' },
        { value: 'Maceleni Roman Catholic Church', label: 'Maceleni Roman Catholic Church' },
        { value: 'Mbuluzana Metropolitan Church', label: 'Mbuluzana Metropolitan Church' },
        { value: 'Salukazi Methodist Primary School', label: 'Salukazi Methodist Primary School' },
        { value: 'Seven Holy Founders Primary School', label: 'Seven Holy Founders Primary School' },
        { value: 'Kwaluseni Central Primary School', label: 'Kwaluseni Central Primary School' },
        { value: 'Kwaluseni Infant Primary School', label: 'Kwaluseni Infant Primary School' },
        { value: 'Mbikwakhe Primary School', label: 'Mbikwakhe Primary School' },
        { value: 'Modison Hall', label: 'Modison Hall' },
        { value: 'Matsapha Government School', label: 'Matsapha Government School' },
        { value: 'Mhlane Gogo Centre', label: 'Mhlane Gogo Centre' },
        { value: 'Phocweni Primary School', label: 'Phocweni Primary School' },
        { value: 'Kuthokozeni Primary School', label: 'Kuthokozeni Primary School' },
        { value: 'Mhlangeni Primary School', label: 'Mhlangeni Primary School' },
        { value: 'Nyandza High School', label: 'Nyandza High School' },
        { value: 'Luhleko Community Primary School', label: 'Luhleko Community Primary School' },
        { value: 'Othandweni Primary School', label: 'Othandweni Primary School' },
        { value: 'Engwenyameni Primary School', label: 'Engwenyameni Primary School' },
        { value: 'Kufinyeni Gogo Centre', label: 'Kufinyeni Gogo Centre' },
        { value: 'St Andrew’s Primary School', label: 'St Andrew’s Primary School' },
        { value: 'Usuthu Mission Primary School', label: 'Usuthu Mission Primary School' },
        { value: 'Bethany Mission Primary School', label: 'Bethany Mission Primary School' },
        { value: 'Mahlanya Primary School', label: 'Mahlanya Primary School' },
        { value: 'Kudzeni Gogo Centre', label: 'Kudzeni Gogo Centre' },
        { value: 'Cinisweni Primary School', label: 'Cinisweni Primary School' },
        { value: 'Lozitha High School', label: 'Lozitha High School' },
        { value: 'Mbekelweni Lutheran High School', label: 'Mbekelweni Lutheran High School' },
        { value: 'Mpholi Pre-School', label: 'Mpholi Pre-School' },
        { value: 'Sihhohhweni Pre-School', label: 'Sihhohhweni Pre-School' },
        { value: 'Emphakatsi Hall', label: 'Emphakatsi Hall' },
        { value: 'Ludzeludze Primary School', label: 'Ludzeludze Primary School' },
        { value: 'Zombodze High School', label: 'Zombodze High School' },
        { value: 'Bhudla Primary School', label: 'Bhudla Primary School' },
        { value: 'Luhlokohla Primary School', label: 'Luhlokohla Primary School' },
        { value: 'Ekuthokozeni Primary School', label: 'Ekuthokozeni Primary School' },
        { value: 'Mafutseni RC Primary School', label: 'Mafutseni RC Primary School' },
        { value: 'Ngogola Worth Church', label: 'Ngogola Worth Church' },
        { value: 'EWC Church', label: 'EWC Church' },
        { value: 'Mhlamanti Assemblies', label: 'Mhlamanti Assemblies' },
        { value: 'Mhumbe High School', label: 'Mhumbe High School' },
        { value: 'Vulamehlo Primary School', label: 'Vulamehlo Primary School' },
        { value: 'World Vision Hall', label: 'World Vision Hall' },
        { value: 'Nyatsini Primary School', label: 'Nyatsini Primary School' },
        { value: 'Nyatsini Primary School', label: 'Nyatsini Primary School' },
        { value: 'Dzanyana Primary School', label: 'Dzanyana Primary School' },
        { value: 'Ntfungula Primary School', label: 'Ntfungula Primary School' },
        { value: 'Kuphakameni Primary School', label: 'Kuphakameni Primary School' },
        { value: 'Mavovokati Primary School', label: 'Mavovokati Primary School' },
        { value: 'Sibovu RDA', label: 'Sibovu RDA' },
        { value: 'Mgofelweni NCP', label: 'Mgofelweni NCP' },
        { value: 'New Hebron Primary School', label: 'New Hebron Primary School' },
        { value: 'Ndzeleni Primary School', label: 'Ndzeleni Primary School' },
        { value: 'Emachaweni AEC', label: 'Emachaweni AEC' },
        { value: 'Sigcineni Primary School', label: 'Sigcineni Primary School' },
        { value: 'Zamani Primary School', label: 'Zamani Primary School' },
        { value: 'Dwalile High School', label: 'Dwalile High School' },
        { value: 'Mafutseni West Hall', label: 'Mafutseni West Hall' },
        { value: 'Mangcongco Primary School', label: 'Mangcongco Primary School' },
        { value: 'Malutha - Near Teachers’ Quarters', label: 'Malutha - Near Teachers’ Quarters' },
        { value: 'Osuthu Methodist Primary School', label: 'Osuthu Methodist Primary School' },
        { value: 'Umphakatsi Hall', label: 'Umphakatsi Hall' },
        { value: 'Hillside School Hall', label: 'Hillside School Hall' },
        { value: 'Sobhuza Clinic', label: 'Sobhuza Clinic' },
        { value: 'Manzini Central Hall', label: 'Manzini Central Hall' },
        { value: 'Madonsa Free Evangelical Church', label: 'Madonsa Free Evangelical Church' },
        { value: 'Mzimnene Emphakatsi (Emagomini)', label: 'Mzimnene Emphakatsi (Emagomini)' },
        { value: 'St Paul’s Methodist Church', label: 'St Paul’s Methodist Church' },
        { value: 'Manzini Nazarene', label: 'Manzini Nazarene' },
        { value: 'Mjingo High School', label: 'Mjingo High School' },
        { value: 'FEA Pre-School', label: 'FEA Pre-School' },
        { value: 'Ngwane Park High School', label: 'Ngwane Park High School' },
        { value: 'Ticancweni NCP', label: 'Ticancweni NCP' },
        { value: 'Zakhele Community Hall', label: 'Zakhele Community Hall' },
        { value: 'Bhunya Hall', label: 'Bhunya Hall' },
        { value: 'Mhlambanyatsi Hall', label: 'Mhlambanyatsi Hall' },
        { value: 'Dingizwe Primary School', label: 'Dingizwe Primary School' },
        { value: 'Lundzi Primary School', label: 'Lundzi Primary School' },
        { value: 'Mpuluzi High School', label: 'Mpuluzi High School' },
        { value: 'Intuthuko Primary School', label: 'Intuthuko Primary School' },
        { value: 'Mgotjane Primary School', label: 'Mgotjane Primary School' },
        { value: 'Mlindazwe High School', label: 'Mlindazwe High School' },
        { value: 'Mphakamela Primary School', label: 'Mphakamela Primary School' },
        { value: 'Zondwako Primary School', label: 'Zondwako Primary School' },
        { value: 'Zondwako Primary School', label: 'Zondwako Primary School' },
        { value: 'Jabulane NCP', label: 'Jabulane NCP' },
        { value: 'Mbuluzi Methodist Primary School', label: 'Mbuluzi Methodist Primary School' },
        { value: 'Mliba High School', label: 'Mliba High School' },
        { value: 'Emganwini Goods-shed Hall', label: 'Emganwini Goods-shed Hall' },
        { value: 'Lamawandla High School', label: 'Lamawandla High School' },
        { value: 'Sidvokodvo Primary School', label: 'Sidvokodvo Primary School' },
        { value: 'Khuphuka Primary School', label: 'Khuphuka Primary School' },
        { value: 'Mbelebeleni NCP', label: 'Mbelebeleni NCP' },
        { value: 'Mnjoli Primary School', label: 'Mnjoli Primary School' },
        { value: 'Gundvwini Primary School', label: 'Gundvwini Primary School' },
        { value: 'Lomveshe Primary School', label: 'Lomveshe Primary School' },
        { value: 'Hlane/ Bulunga Primary School', label: 'Hlane/ Bulunga Primary School' },
        { value: 'Bugeleni Primary School', label: 'Bugeleni Primary School' },
        { value: 'Emphakatsi', label: 'Emphakatsi' },
        { value: 'Roman Catholic Church', label: 'Roman Catholic Church' },
        { value: 'Assemblies Of God Church', label: 'Assemblies Of God Church' },
        { value: 'Mkhuzweni Primary School', label: 'Mkhuzweni Primary School' },
        { value: 'Christian Revival Church', label: 'Christian Revival Church' },
        { value: 'Ngwempisi Inkhundla Hall', label: 'Ngwempisi Inkhundla Hall' },
        { value: 'Dladleni Primary School', label: 'Dladleni Primary School' },
        { value: 'Mhlatane Primary School', label: 'Mhlatane Primary School' },
        { value: 'Mbeka Primary School', label: 'Mbeka Primary School' },
        { value: 'Ndlaleni Primary School', label: 'Ndlaleni Primary School' },
        { value: 'Ngcoseni Central High School', label: 'Ngcoseni Central High School' },
        { value: 'Ngcoseni High School', label: 'Ngcoseni High School' },
        { value: 'Kukhulumeni Primary School', label: 'Kukhulumeni Primary School' },
        { value: 'Mankayane High School', label: 'Mankayane High School' },
        { value: 'Mtimane Primary School', label: 'Mtimane Primary School' },
        { value: 'Velezizweni Primary School', label: 'Velezizweni Primary School' },
        { value: 'Masundvwini Primary School', label: 'Masundvwini Primary School' },
        { value: 'Jabez School', label: 'Jabez School' },
        { value: 'Nhlambeni Nazarene Primary School', label: 'Nhlambeni Nazarene Primary School' },
        { value: 'Mtfonjeni High School', label: 'Mtfonjeni High School' },
        { value: 'Nhlambeni Community Primary School', label: 'Nhlambeni Community Primary School' },
        { value: 'New Mbuluzi Primary School', label: 'New Mbuluzi Primary School' },
        { value: 'New Mbuluzi Primary School', label: 'New Mbuluzi Primary School' },
        { value: 'KaMhlahlo Primary School', label: 'KaMhlahlo Primary School' },
        { value: 'Sisekelweni Church', label: 'Sisekelweni Church' },
        { value: 'Ntunja Primary School', label: 'Ntunja Primary School' },
        { value: 'Sankolweni Primary School', label: 'Sankolweni Primary School' },
        { value: 'Sibuyeni Primary School', label: 'Sibuyeni Primary School' },
        { value: 'Lomngeletjane Primary School', label: 'Lomngeletjane Primary School' },
        { value: 'Mvubula Primary School', label: 'Mvubula Primary School' },
        { value: 'Vusweni High School', label: 'Vusweni High School' },
        { value: 'Vusweni Primary School', label: 'Vusweni Primary School' },
        { value: 'Gebeni High School', label: 'Gebeni High School' },
        { value: 'Gebeni Primary School', label: 'Gebeni Primary School' },
        { value: 'Khalangilile Primary School', label: 'Khalangilile Primary School' },
        { value: 'Mphini High School', label: 'Mphini High School' },
        { value: 'Ncabaneni High School', label: 'Ncabaneni High School' },
        { value: 'KaNdinda Primary School', label: 'KaNdinda Primary School' },
        { value: 'Makhungutsha Primary School', label: 'Makhungutsha Primary School' },
        { value: 'Church of God', label: 'Church of God' },
        { value: 'Makhungutsha Primary School', label: 'Makhungutsha Primary School' },
        { value: 'Ntondozi Primary School', label: 'Ntondozi Primary School' },
        { value: 'Mponono Primary School', label: 'Mponono Primary School' },
        { value: 'Khabonina NCP', label: 'Khabonina NCP' },
        { value: 'Agriculture Farm Primary School', label: 'Agriculture Farm Primary School' },
        { value: 'Nokuthula High School', label: 'Nokuthula High School' },
        { value: 'Tentele Primary School', label: 'Tentele Primary School' },
        { value: 'Gugwini Primary School', label: 'Gugwini Primary School' },
        { value: 'Nkanyezini Primary School', label: 'Nkanyezini Primary School' },
        { value: 'Phumtile High School', label: 'Phumtile High School' }
    ];

    const [selectedOption, setSelectedOption] = useState(null);



    const getConfirmationMessage = () => {
        if (confirmationCount === 0) {
            return "Before submitting the vote, please ensure that you have entered the correct vote.";
        } else {
            return "Are you sure you want to submit the vote?";
        }
    };

    const handleVoteSubmission = async () => {
        const confirmationMessage = getConfirmationMessage();
        if (editedRecord) {
            const updatedMP = MP.filter((item) => item.id !== editedRecord.id);
            setMP(updatedMP);
            setEditedRecord(null); // Reset the edited record
            setStatus(true);
        }
        const isConfirmed = window.confirm(confirmationMessage);
        if (isConfirmed) {
            if (confirmationCount < 1) {
                setConfirmationCount(confirmationCount + 1);
            } else {
                // Call the function to submit the vote using a transaction
                await updateMP(product, pollstation);

                setConfirmationCount(0); // Reset the confirmation count after successful submission
                setVoteSubmitted(true); // Mark the vote as submitted
                setButtonDisabled(true); // Disable the "SAVE" button
            }
        }
    };

    const handleVoteSubmissionIndvuna = async () => {
        const confirmationMessage = getConfirmationMessage();
        if (editedRecord) {
            const updatetindvuna = tindvuna.filter(
                (item) => item.id !== editedRecord.id
            );

            setTindvuna(updatetindvuna);
            setEditedRecord(null); // Reset the edited record
            setStatus(true);
        }
        const isConfirmed = window.confirm(confirmationMessage);
        if (isConfirmed) {
            if (confirmationCount < 1) {
                setConfirmationCount(confirmationCount + 1);
            } else {
                // Call the function to submit the vote using a transaction
                await updatetindvuna(product, pollstation);

                setConfirmationCount(0); // Reset the confirmation count after successful submission
                setVoteSubmitted(true); // Mark the vote as submitted
                setButtonDisabled(true); // Disable the "SAVE" button
            }
        }
    };

    const handleVoteSubmissionBucopho = async () => {
        const confirmationMessage = getConfirmationMessage();
        if (editedRecord) {
            const updatebucopho = bucopho.filter(
                (item) => item.id !== editedRecord.id
            );
            setBucopho(updatebucopho);
            setEditedRecord(null); // Reset the edited record
            setStatus(true);
        }
        const isConfirmed = window.confirm(confirmationMessage);
        if (isConfirmed) {
            if (confirmationCount < 1) {
                setConfirmationCount(confirmationCount + 1);
            } else {
                // Call the function to submit the vote using a transaction
                await updateBucopho(product, pollstation);

                setConfirmationCount(0); // Reset the confirmation count after successful submission
                setVoteSubmitted(true); // Mark the vote as submitted
                setButtonDisabled(true); // Disable the "SAVE" button
            }
        }
    };

    const [product, setProduct] = useState({
        name: "",
        price: 0,
        imageUrl: "",
        category: "",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);
    const handleClose4 = () => setShow4(false);
    const handleClose5 = () => setShow5(false);
    const handleClose6 = () => setShow6(false);


    const handleClose7 = () => setShow7(false);
    const handleClose8 = () => setShow8(false);
    const handleClose9 = () => setShow9(false);


    const handleShow2 = () => setShow2(true);
    console.log("Test Poll " + poll);

    async function getOrdersData(selectedCountry, selectedState, selectedCity) {
        try {
            setLoading(true);


            let db_path = `/${selectedCountry}/${selectedState}/${selectedCity}`;
            setUrl(db_path)
            setUrlSecondary(`/${selectedCountry}/${selectedState}/Secondary`)
            console.log("Test10 Poll " + db_path);
            console.log("Test10.1 Poll " + primary_poll);


            console.log("Test2 Poll " + poll);
            const product = await getDocs(collection(fireDB, `${urlsecondary}/MP/nominees`));

            const productsArray = [];
            product.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray.push(obj);
                setLoading(false);
            });
            setMP(productsArray);
            console.log(productsArray);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    async function getPollingsData(selectedCountry, selectedState, selectedCity) {
        try {
            setLoading(true);


            const product2 = await getDocs(
                collection(fireDB, `${url}/Pollings/stations`)
            );


            const productsArray2 = [];
            product2.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray2.push(obj);
                setLoading(false);
            });
            setTurnout(productsArray2);
            console.log(productsArray2);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function getTinkhundlaData(selectedCountry, selectedState, selectedCity) {
        try {
            setLoading(true);


            const productData = await getDocs(
                collection(fireDB, `${urlsecondary}/Indvuna/nominees`)
            );
            const productsArray = [];
            productData.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray.push(obj);
            });
            setTindvuna(productsArray);
            setLoading(false);
            console.log("from tinkhundla " + productsArray);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function getBucophoData(selectedCountry, selectedState, selectedCity) {
        try {
            setLoading(true);


            const productData = await getDocs(
                collection(fireDB, `${url}/Bucopho/nominees`)
            );
            const productsArray = [];
            productData.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray.push(obj);
            });
            setBucopho(productsArray);
            setLoading(false);
            console.log(productsArray);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const editHandler = (item) => {
        setPollstation("SPECIAL")
        setProduct(item);
        setShow(true);
    };

    const editHandler5 = (item) => {
        setPollstation("DIASPORA")

        setProduct(item);
        setShow5(true);

    }; const editHandler6 = (item) => {
        setPollstation("INMATE")

        setProduct(item);
        setShow6(true);
    };

    const editHandler2 = (item) => {

        setProduct(item);
        setShow2(true);
    };

    const editHandler3 = (item) => {
        setProduct(item);
        setShow3(true);
    };

    const editHandler4 = (item) => {
        setProduct(item);
        setShow4(true);
    };
    const editHandler7 = (item) => {
        setProduct(item);
        setShow7(true);
    };
    const editHandler8 = (item) => {
        setProduct(item);
        setShow8(true);
    };
    const editHandler9 = (item) => {
        setProduct(item);
        setShow9(true);
    };

    const updateMP = async (product, pollstation) => {
        const mpDocRef = doc(fireDB, `${urlsecondary}/MP/nominees`, product.id);
        try {
            await runTransaction(fireDB, async (transaction) => {
                const mpDocSnapshot = await getDoc(mpDocRef, transaction);

                if (!mpDocSnapshot.exists()) {
                    throw new Error("MP nominee document does not exist.");
                }

                const mpData = mpDocSnapshot.data();
                const updatedVotes = {
                    ...mpData.secondary_votes,
                    [pollstation]: product.secondary_votes[pollstation],
                };

                // Update the primary_votes field with the new votes
                transaction.update(mpDocRef, { secondary_votes: updatedVotes });
            });

            toast.success("MP Results captured successfully");
            window.location.reload();
            handleClose();
        } catch (error) {
            toast.error("Failed to vote: " + error.message);
        }
    };

    const updatetindvuna = async (product, pollstation) => {
        const indvunaDocRef = doc(fireDB, `${urlsecondary}/Indvuna/nominees`, product.id);
        try {
            await runTransaction(fireDB, async (transaction) => {
                const indvunaDocSnapshot = await getDoc(indvunaDocRef, transaction);

                if (!indvunaDocSnapshot.exists()) {
                    throw new Error("Indvuna nominee document does not exist.");
                }

                const indvunaData = indvunaDocSnapshot.data();
                const updatedVotes = {
                    ...indvunaData.secondary_votes,
                    [pollstation]: product.secondary_votes[pollstation],
                };

                // Update the primary_votes field with the new votes
                transaction.update(indvunaDocRef, { secondary_votes: updatedVotes });
            });

            toast.success("Indvuna Results captured successfully");
            window.location.reload();
            handleClose();
        } catch (error) {
            toast.error("Failed to vote: " + error.message);
        }
    };

    const updateBucopho = async (product, pollstation) => {
        const mpDocRef = doc(
            fireDB,
            `${url}/Bucopho/nominees`,
            product.id
        );
        try {
            await runTransaction(fireDB, async (transaction) => {
                const mpDocSnapshot = await getDoc(mpDocRef, transaction);

                if (!mpDocSnapshot.exists()) {
                    throw new Error("Bucopho nominee document does not exist.");
                }

                const mpData = mpDocSnapshot.data();
                const updatedVotes = {
                    ...mpData.secondary_votes,
                    [pollstation]: product.secondary_votes[pollstation],
                };

                // Update the primary_votes field with the new votes
                transaction.update(mpDocRef, { secondary_votes: updatedVotes });
            });

            toast.success("Bucopho Results captured successfully");
            window.location.reload();
            handleClose();
        } catch (error) {
            toast.error("Failed to vote: " + error.message);
        }
    };

    const updateturnout = async () => {
        try {
            setLoading(true);
            await setDoc(
                doc(fireDB, `${url}/Pollings/stations`, product.id),
                product
            );
            toast.success("Turnout has successfully added");
            window.location.reload();
            handleClose3();
        } catch (error) {
            setLoading(false);
            toast.error("failed to add");
        }
    };


    useEffect(() => {
        getOrdersData(country, state, city)
        getTinkhundlaData(country, state, city);
        getPollingsData(country, state, city)
        getBucophoData(country, state, city)
    }, []);

    const tableStyles = {
        backgroundColor: "#fff",
        borderCollapse: "collapse",
        width: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
    };

    const actionIconsStyles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const smallfont = {
        fontSize: "90%",
        fontWeight: "80%",
    };

    const buttonContainerStyles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const buttonRowStyles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const buttonStyles = {
        padding: "40px 80px",
        margin: "10px",
        fontSize: "16px",
        border: "2px solid #000", // Add borders
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const buttonBlue = {
        ...buttonStyles,
        color: "#007bff",
    };

    const buttonRed = {
        ...buttonStyles,
        color: "#dc3545",
    };

    const buttonGreen = {
        ...buttonStyles,
        color: "#28a745",
    };

    const buttonPurple = {
        ...buttonStyles,
        color: "#6f42c1",
    };

    const downloadIconStyles = {
        fontSize: "24px",
        marginTop: "5px",
    };


    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        // Ensure that 'mymapData' is available in the component's state or retrieved from localStorage.
        const mymapData = JSON.parse(localStorage.getItem('mymapData'));
        const mymapData2 = JSON.parse(localStorage.getItem('mymapData2'));


        if (mymapData && mymapData2) {
            // Retrieve the value associated with the selected key
            const selectedValue = mymapData[selectedOption];
            const selectedValue2 = mymapData2[selectedOption];


            // Now, you have both the selected key and its associated value
            console.log("Selected option:", selectedOption);
            console.log("Selected value:", selectedValue);
            localStorage.setItem('mypolling', selectedValue);
            localStorage.setItem('mypolling2', selectedValue2);

        }

        window.location.href = "/results";

    };

    const handleFormSubmit2 = async (e, selectedCountry, selectedState, selectedCity, selectedOption) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const phoneValue = "268" + mobileNumber;

        try {
            const pollURL = `/${selectedCountry}/${selectedState}`;
            const pollingStation = `${selectedOption.value}`;
            const primaryPollUrl = `/${selectedCountry}/${selectedState}/${selectedCity}`;

            // Check if the document exists in Firestore
            const docRef = doc(fireDB, "clerk", `${phoneValue}`);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                // If the document exists, update the "REGISTER" and "REGISTER2" maps
                const currentData = docSnapshot.data();
                currentData.REGISTER = { ...currentData.REGISTER, [pollingStation]: primaryPollUrl };
                currentData.REGISTER2 = { ...currentData.REGISTER2, [pollingStation]: pollURL };

                // Update the document with the updated data
                await setDoc(docRef, currentData);
            } else {
                // If the document doesn't exist, create a new one with the maps
                await setDoc(docRef, {
                    REGISTER: { [pollingStation]: primaryPollUrl },
                    REGISTER2: { [pollingStation]: pollURL },
                    // Add more key-value pairs as needed
                });
            }


            toast.success("Clerk Added successfully");
            window.location.reload();
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };


    // const [selectedOption, setSelectedOption] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);

    useEffect(() => {
        // Retrieve and parse 'mymapData' from localStorage
        const mymapData = JSON.parse(localStorage.getItem('mymapData'));

        if (mymapData) {
            // Extract the keys from 'mymapData' and store them in the dropdownOptions state
            const keys = Object.keys(mymapData);
            setDropdownOptions(keys);
        }
    }, []);

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        <Layout loading={loading}>
            <Tabs
                defaultActiveKey="mps"
                id="uncontrolled-tab-example"
                className="mb-3 mt-6"
            >

                <Tab eventKey="mps" title="CAPTURE RESULTS">

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '20vh' }}>
                        <form
                            onSubmit={handleFormSubmit}
                            style={{
                                width: '80%',
                                maxWidth: '600px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <select
                                    value={selectedOption}
                                    onChange={handleDropdownChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px', // Add this property
                                        border: '1px solid #ccc', // Example border style
                                    }}
                                >
                                    <option value="">Select Your Polling Station</option>
                                    {dropdownOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ width: '100%' }}>
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        padding: '10px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    GET CANDIDATE
                                </button>
                            </div>
                        </form>
                    </div>


                </Tab>




                <Tab eventKey="reg" title="REGISTER NEW USERS">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '20vh' }}>
                        <form onSubmit={(e) => handleFormSubmit2(e, country, state, city, selectedOption)} style={{ width: '80%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <select
                                    value={country}
                                    onChange={handleCountryChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px', // Add this property
                                        border: '1px solid #ccc', // Example border style
                                    }}
                                >
                                    <option value="">Select Your Region</option>
                                    {countries}
                                </select>
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <select
                                    value={state}
                                    onChange={handleStateChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px', // Add this property
                                        border: '1px solid #ccc', // Example border style
                                    }}
                                >
                                    <option value="">Select Your Inkhundla2222</option>
                                    {states}
                                </select>
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <select
                                    value={city}
                                    onChange={handleCityChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px', // Add this property
                                        border: '1px solid #ccc', // Example border style
                                    }}
                                >
                                    <option value="">Select Your Chiefdom</option>
                                    {cities}
                                </select>
                            </div>

                            <div style={{ marginBottom: '10px', width: '100%', }}>
                                <Select
                                    style={{ marginBottom: '100px', width: '100%', height: 'auto', overflowY: 'scroll' }}
                                    value={selectedOption}
                                    onChange={setSelectedOption}
                                    options={searchableOptions}
                                    isSearchable={true}
                                    placeholder="Enter / Select Your Polling Station"
                                />
                            </div>

                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Your Mobile Number"
                                    value={mobileNumber}
                                    onChange={handleMobileNumberChange}
                                    style={{ width: '100%', padding: '10px' }}
                                />
                            </div>

                            <button type="submit" style={{ width: '100%', backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>REGISTER</button>

                        </form>

                    </div>
                </Tab>



                <Tab eventKey="turnout" title="DOWNLOAD RESULTS">
                    <div className="d-flex justify-content-center">
                        <div style={buttonContainerStyles}>
                            <div style={buttonRowStyles}>
                                <button style={buttonBlue} onClick={handleButtonClickHhohho}>
                                    <span style={smallfont}>HHOHHO</span>
                                    <i className="fas fa-download" style={downloadIconStyles}></i>
                                </button>
                                <button style={buttonRed} onClick={handleButtonClickManzini}>
                                    <span style={smallfont}>MANZINI</span>
                                    <i className="fas fa-download" style={downloadIconStyles}></i>
                                </button>
                            </div>
                            <div style={buttonRowStyles}>
                                <button style={buttonGreen} onClick={handleButtonClickLubombo}>
                                    <span style={smallfont}>LUBOMBO</span>
                                    <i className="fas fa-download" style={downloadIconStyles}></i>
                                </button>
                                <button style={buttonPurple} onClick={handleButtonClick}>
                                    <span style={smallfont}>SHISELWENI</span>
                                    <i className="fas fa-download" style={downloadIconStyles}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </Tab>

            </Tabs>
        </Layout>
    );
}

export default AdminPage;
