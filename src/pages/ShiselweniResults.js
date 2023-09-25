import {
    Document,
    PDFViewer,
    Page,
    StyleSheet,
    Text,
    View
} from "@react-pdf/renderer";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ErrorBoundary from "./ErrorBoundary";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDns625k8bwUuNxw8f9mLVz_pH2956fWL8",
    authDomain: "ebc-app-aead3.firebaseapp.com",
    databaseURL: "https://ebc-app-aead3-default-rtdb.firebaseio.com",
    projectId: "ebc-app-aead3",
    storageBucket: "ebc-app-aead3.appspot.com",
    messagingSenderId: "789710588741",
    appId: "1:789710588741:web:b5b19e63a97625bada4c2c",
    measurementId: "G-YPVE7EW8HK",
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const MyPDF = ({ data, titles }) => {
    // Sort data in descending order of totalSecondaryVotes
    data.sort((a, b) => b.totalSecondaryVotes - a.totalSecondaryVotes);

    return (
        <Page size="A3">
            <View style={styles.container}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Name</Text>
                    <Text style={styles.headerCell}>Surname</Text>
                    <Text style={styles.headerCell}>Chiefdom</Text>
                    <Text style={styles.headerCell}>Inkhundla</Text>
                    <Text style={styles.headerCell}>Region</Text>
                    <Text style={styles.headerCell}>INMATES</Text>
                    <Text style={styles.headerCell}>DIASPORA</Text>
                    <Text style={styles.headerCell}>SPECIAL</Text>
                    <Text style={styles.headerCell}>Secondary</Text>
                    <Text style={styles.headerCell}>Total</Text>
                </View>

                {titles.map((title, index) => (
                    <React.Fragment key={index}>
                        <Text style={styles.title}>{title}</Text>
                        {data[index].map((nominee, i) => {
                            // Calculate the total secondary votes for the nominee
                            const secondaryVotes = nominee.secondary_votes || {};
                            const inmates = parseInt(secondaryVotes.INMATE) || 0;
                            const diaspora = parseInt(secondaryVotes.DIASPORA) || 0;
                            const special = parseInt(secondaryVotes.SPECIAL) || 0;
                            const totalSecondaryVotes = Object.values(
                                nominee.secondary_votes || {}
                            ).reduce((total, votes) => total + parseInt(votes || 0), 0);

                            const SecondaryVotesTotal = Object.entries(secondaryVotes).reduce(
                                (total, [key, votes]) => {
                                    if (
                                        key !== "INMATE" &&
                                        key !== "DIASPORA" &&
                                        key !== "SPECIAL"
                                    ) {
                                        return total + parseInt(votes || 0);
                                    }
                                    return total;
                                },
                                0
                            );

                            return (
                                <View key={i} style={styles.nominee}>
                                    <Text style={styles.cell}>{nominee.name || "N/A"}</Text>
                                    <Text style={styles.cell}>{nominee.surname || "N/A"}</Text>
                                    <Text style={styles.cell}>{nominee.chiefdom || "N/A"}</Text>
                                    <Text style={styles.cell}>{nominee.inkhundla || "N/A"}</Text>
                                    <Text style={styles.cell}>{nominee.region || "N/A"}</Text>
                                    <Text style={styles.cell}>{inmates || "0"}</Text>
                                    <Text style={styles.cell}>{diaspora || "0"}</Text>
                                    <Text style={styles.cell}>{special || "0"}</Text>
                                    <Text style={styles.cell}>{SecondaryVotesTotal || "0"}</Text>
                                    <Text style={styles.cell}>{totalSecondaryVotes || "0"}</Text>
                                </View>
                            );
                        })}
                    </React.Fragment>
                ))}
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        fontSize: 8,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#0074e4",
        color: "#ffffff",
        padding: 5,
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
        // textAlign: "center",
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
    },
    nominee: {
        flexDirection: "row",
        marginBottom: 5,
    },
    cell: {
        flex: 1,
    },
});

function ShiselweniResults() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchNomineeData = async () => {
            try {
                const urls = [
                    //SHISELWENI MP
                    "/Shiselweni/Gege/Secondary/MP/nominees",
                    "/Shiselweni/Hosea/Secondary/MP/nominees",
                    "/Shiselweni/KuMethula/Secondary/MP/nominees",
                    "/Shiselweni/Kubuta/Secondary/MP/nominees",
                    "/Shiselweni/Maseyisini/Secondary/MP/nominees",
                    "/Shiselweni/Matsanjeni_South/Secondary/MP/nominees",
                    "/Shiselweni/Mtsambama/Secondary/MP/nominees",
                    "/Shiselweni/Ngudzeni/Secondary/MP/nominees",
                    "/Shiselweni/Nkwene/Secondary/MP/nominees",
                    "/Shiselweni/Sandleni/Secondary/MP/nominees",
                    "/Shiselweni/Shiselweni_1/Secondary/MP/nominees",
                    "/Shiselweni/Shiselweni_2/Secondary/MP/nominees",
                    "/Shiselweni/Sigwe/Secondary/MP/nominees",
                    "/Shiselweni/Somntongo/Secondary/MP/nominees",
                    "/Shiselweni/Zombodze_Emuva/Secondary/MP/nominees",

                    // SHISELWENI INDVUNA
                    "/Shiselweni/Gege/Secondary/Indvuna/nominees",
                    "/Shiselweni/Hosea/Secondary/Indvuna/nominees",
                    "/Shiselweni/KuMethula/Secondary/Indvuna/nominee",
                    "/Shiselweni/Kubuta/Secondary/Indvuna/nominees",
                    "/Shiselweni/Maseyisini/Secondary/Indvuna/nominees",
                    "/Shiselweni/Matsanjeni_South/Secondary/Indvuna/nominees",
                    "/Shiselweni/Mtsambama/Secondary/Indvuna/nominees",
                    "/Shiselweni/Ngudzeni/Secondary/Indvuna/nominees",
                    "/Shiselweni/Nkwene/Secondary/Indvuna/nominees",
                    "/Shiselweni/Sandleni/Secondary/Indvuna/nominees",
                    "/Shiselweni/Shiselweni_1/Secondary/Indvuna/nominees",
                    "/Shiselweni/Shiselweni_2/Secondary/Indvuna/nominees",
                    "/Shiselweni/Sigwe/Secondary/Indvuna/nominees",
                    "/Shiselweni/Somntongo/Secondary/Indvuna/nominees",
                    "/Shiselweni/Zombodze_Emuva/Secondary/Indvuna/nominees",

                    //SHISELWENI BUCOPHO - GEGE
                    "/Shiselweni/Gege/Dilini/Bucopho/nominees",
                    "/Shiselweni/Gege/KaDinga/Bucopho/nominees",
                    "/Shiselweni/Gege/KaTsambekwako/Bucopho/nominees",
                    "/Shiselweni/Gege/Mashobeni_South/Bucopho/nominees",
                    "/Shiselweni/Gege/Mhlahlweni/Bucopho/nominees",
                    "/Shiselweni/Gege/Mlindazwe/Bucopho/nominees",
                    "/Shiselweni/Gege/Nshamanti/Bucopho/nominees",
                    "/Shiselweni/Gege/Nsukazi/Bucopho/nominees",
                    "/Shiselweni/Gege/Sidwala/Bucopho/nominees",
                    "/Shiselweni/Gege/Sisingeni/Bucopho/nominees",
                    "/Shiselweni/Gege/Siyendle/Bucopho/nominees",

                    //SHISELWENI BUCOPHO HOSEA
                    "/Shiselweni/Hosea/Bufaneni/Bucopho/nominees",
                    "/Shiselweni/Hosea/Hhohho_Emuva/Bucopho/nominees",
                    "/Shiselweni/Hosea/KaLiba/Bucopho/nominees",
                    "/Shiselweni/Hosea/Lushini/Bucopho/nominees",
                    "/Shiselweni/Hosea/Manyiseni/Bucopho/nominees",
                    "/Shiselweni/Hosea/Nsingizini/Bucopho/nominees",
                    "/Shiselweni/Hosea/Ondiyaneni/Bucopho/nominees",

                    //SHISELWENI BUCOPHO KUMETHULA
                    "/Shiselweni/KuMethula/Gasa/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Khamsile/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Lomfa/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Mbabane/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Mbangweni/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Nkalaneni/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Nkomonye/Bucopho/nominees",
                    "/Shiselweni/KuMethula/Nzameya/Bucopho/nominees",

                    //SHISELWENI BUCOPHO KUBUTA
                    "/Shiselweni/Kubuta/Ezishineni/Bucopho/nominees",
                    "/Shiselweni/Kubuta/KaGwebu/Bucopho/nominees",
                    "/Shiselweni/Kubuta/KaKholwane/Bucopho/nominees",
                    "/Shiselweni/Kubuta/KaMbhoke/Bucopho/nominees",
                    "/Shiselweni/Kubuta/KaPhunga/Bucopho/nominees",
                    "/Shiselweni/Kubuta/Manyeveni/Bucopho/nominees",
                    "/Shiselweni/Kubuta/Ngobelweni/Bucopho/nominees",
                    "/Shiselweni/Kubuta/Nhlalabantfu/Bucopho/nominees",

                    //SHISELWENI BUCOPHO MASEYISINI
                    "/Shiselweni/Maseyisini/Dlovunga/Bucopho/nominees",
                    "/Shiselweni/Maseyisini/KaMzizi/Bucopho/nominees",
                    "/Shiselweni/Maseyisini/Masibini/Bucopho/nominees",
                    "/Shiselweni/Maseyisini/Mbilaneni/Bucopho/nominees",
                    "/Shiselweni/Maseyisini/Simemeni/Bucopho/nominees",
                    "/Shiselweni/Maseyisini/Vusweni/Bucopho/nominees",

                    //SHISELWENI BUCOPHO MATSANJENI SOUTH
                    "/Shiselweni/Matsanjeni_South/Bambitje/Bucopho/nominees",
                    "/Shiselweni/Matsanjeni_South/Dinabanye/Bucopho/nominees",
                    "/Shiselweni/Matsanjeni_South/Kwaluseni/Bucopho/nominees",
                    "/Shiselweni/Matsanjeni_South/Nkonka/Bucopho/nominees",
                    "/Shiselweni/Matsanjeni_South/Nsalitje/Bucopho/nominees",
                    "/Shiselweni/Matsanjeni_South/Qomintaba/Bucopho/nominees",

                    //SHISELWENI BUCOPHO MTSAMBAMA
                    "/Shiselweni/Mtsambama/Bhanganoma/Bucopho/nominees",
                    "/Shiselweni/Mtsambama/Ebenezer/Bucopho/nominees",
                    "/Shiselweni/Mtsambama/KaZenzile/Bucopho/nominees",
                    "/Shiselweni/Mtsambama/Kwendzeni/Bucopho/nominees",
                    "/Shiselweni/Mtsambama/Magele/Bucopho/nominees",

                    //SHISELWENI BUCOPHO KAMHAWU
                    "/Shiselweni/Ngudzeni/KaMhawu/Bucopho/nominees",
                    "/Shiselweni/Ngudzeni/KaMkhaya/Bucopho/nominees",
                    "/Shiselweni/Ngudzeni/KaMshengu/Bucopho/nominees",
                    "/Shiselweni/Ngudzeni/Lusitini/Bucopho/nominees",

                    //SHISELWENI BUCOPHO BUSELENI
                    "/Shiselweni/Nkwene/Buseleni/Bucopho/nominees",
                    "/Shiselweni/Nkwene/Ekuphumleni/Bucopho/nominees",
                    "/Shiselweni/Nkwene/Hlobane/Bucopho/nominees",
                    "/Shiselweni/Nkwene/Nkwene/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SANDLENI
                    "/Shiselweni/Sandleni/Ezibondeni_KaShiba/Bucopho/nominees",
                    "/Shiselweni/Sandleni/KaGwegwe/Bucopho/nominees",
                    "/Shiselweni/Sandleni/Ngololweni/Bucopho/nominees",
                    "/Shiselweni/Sandleni/Nhletjeni/Bucopho/nominees",
                    "/Shiselweni/Sandleni/Nkhungwini/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SHISELWENI 1
                    "/Shiselweni/Shiselweni_1/Dumenkungwini/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Eposini/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Hhuhhuma/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Mabonabulawe/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Manyandzeni/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Mchinsweni/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_1/Zikhotheni/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SHISELWENI 2
                    "/Shiselweni/Shiselweni_2/Mahlalini/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Makhwelela/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mathendele/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mbabala/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mbangweni/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mbeka/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mkhitsini/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Mpangisweni/Bucopho/nominees",
                    "/Shiselweni/Shiselweni_2/Sikhotseni/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SIGWE
                    "/Shiselweni/Sigwe/Kuphumleni_Enjabulweni/Bucopho/nominees",
                    "/Shiselweni/Sigwe/Lulakeni/Bucopho/nominees",
                    "/Shiselweni/Sigwe/Ndunayithini/Bucopho/nominees",
                    "/Shiselweni/Sigwe/Nyatsini/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SOMNTONGO
                    "/Shiselweni/Somntongo/Etjeni/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Luhlekweni/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Maplotini/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Nsubane/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Ntuthwakazi/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Phangweni/Bucopho/nominees",
                    "/Shiselweni/Somntongo/Vimbizibuko/Bucopho/nominees",

                    //SHISELWENI BUCOPHO SOMNTONGO
                    "/Shiselweni/Zombodze_Emuva/Bulekeni/Bucopho/nominees",
                    "/Shiselweni/Zombodze_Emuva/Mampondweni/Bucopho/nominees",
                    "/Shiselweni/Zombodze_Emuva/Ngwenyameni/Bucopho/nominees",
                    "/Shiselweni/Zombodze_Emuva/Zombodze/Bucopho/nominees",

                ];

                const dataPromises = urls.map(async (url) => {
                    const querySnapshot = await getDocs(collection(firestore, url));
                    const nominees = querySnapshot.docs.map((doc) => doc.data());

                    // Simulate a delay for demonstration purposes
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    nominees.forEach((nominee) => {
                        const secondaryVotes = nominee.secondary_votes || {};
                        const inmates = parseInt(secondaryVotes.INMATE) || 0;
                        const diaspora = parseInt(secondaryVotes.DIASPORA) || 0;
                        const special = parseInt(secondaryVotes.SPECIAL) || 0;
                        const SecondaryVotesTotal = Object.entries(secondaryVotes).reduce(
                            (total, [key, votes]) => {
                                if (
                                    key !== "INMATE" &&
                                    key !== "DIASPORA" &&
                                    key !== "SPECIAL"
                                ) {
                                    return total + parseInt(votes || 0);
                                }
                                return total;
                            },
                            0
                        );

                        const totalSecondaryVotes =
                            inmates + diaspora + special + SecondaryVotesTotal;

                        nominee.totalSecondaryVotes = totalSecondaryVotes;
                    });

                    return nominees;
                });

                const nomineesData = await Promise.all(dataPromises);

                setData(nomineesData);
                setIsLoading(false);

                console.log("Fetched Data:", nomineesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Simulate a 3-second delay before starting to fetch data
        const delay = 3000;
        const interval = 100;
        let currentProgress = 0;

        const loadingInterval = setInterval(() => {
            currentProgress += (interval / delay) * 100;
            setProgress(Math.min(currentProgress, 100));

            if (currentProgress >= 100) {
                clearInterval(loadingInterval);
                fetchNomineeData();
            }
        }, interval);

        return () => {
            clearInterval(loadingInterval);
        };


        // fetchNomineeData();
    }, []);

    return (
        <div className="App">
            <ErrorBoundary>
                {isLoading ? (
                    // Show loading indicator or message
                    Loader()
                ) : (
                    <PDFViewer width="100%" height="700px">
                        <Document>
                            <MyPDF
                                data={data}
                                titles={[
                                    //MP Gege
                                    "GEGE - MP",
                                    "HOSEA - MP",
                                    "KUMETHULA - MP",
                                    "KUBUTA - MP",
                                    "MASEYISINI - MP",
                                    "MATSABJENI - MP",
                                    "MTSAMBAMA - MP",
                                    "NGUDZENI - MP",
                                    "NKWENE - MP",
                                    "SANDLENI - MP",
                                    "SHISELWENI 1 - MP",
                                    "SHISELWENI 2 - MP",
                                    "SIGWE - MP",
                                    "SOMNTONGO - MP",
                                    "ZOMBODZE EMUVA- MP",

                                    //Indvuna Gege
                                    "GEGE - Indvuna",
                                    "HOSEA - Indvuna",
                                    "KUMETHULA - Indvuna",
                                    "KUBUTA - Indvuna",
                                    "MASEYISINI - Indvuna",
                                    "MATSABJENI - Indvuna",
                                    "MTSAMBAMA - Indvuna",
                                    "NGUDZENI - Indvuna",
                                    "NKWENE - Indvuna",
                                    "SANDLENI - Indvuna",
                                    "SHISELWENI 1 - Indvuna",
                                    "SHISELWENI 2 - Indvuna",
                                    "SIGWE - Indvuna",
                                    "SOMNTONGO - Indvuna",
                                    "ZOMBODZE EMUVA- Indvuna",

                                    //Shiselweni Bucopho- GEGE
                                    "GEGE - DILINI - Bucopho",
                                    "GEGE - KA DINGA - Bucopho",
                                    "GEGE - KA TSAMBEKWAKO - Bucopho",
                                    "GEGE - MASHOBENI SOUTH- Bucopho",
                                    "GEGE - MHLAHLWENI- Bucopho",
                                    "GEGE - MLINDAZWE - Bucopho",
                                    "GEGE - NSHAMANTI - Bucopho",
                                    "GEGE - NSUKAZI - Bucopho",
                                    "GEGE - SIDWALA - Bucopho",
                                    "GEGE - SISINGENI - Bucopho",
                                    "GEGE - SIYENDLE - Bucopho",

                                    //SHISELWENI BUCOPHO HOSEA
                                    "HOSEA - BUFANENI - Bucopho",
                                    "HOSEA - HHOHHO EMUVA- Bucopho",
                                    "HOSEA - KA LIBA - Bucopho",
                                    "HOSEA - LUSHINI - Bucopho",
                                    "HOSEA - MANYISENI - Bucopho",
                                    "HOSEA - NSINGIZINI - Bucopho",
                                    "HOSEA - ONDIYANENI - Bucopho",

                                    //SHISELWENI BUCOPHO KUMETHULA
                                    "KUMETHULA - GASA - Bucopho",
                                    "KUMETHULA - KHAMSILE - Bucopho",
                                    "KUMETHULA - LOMFA - Bucopho",
                                    "KUMETHULA - MBABANE - Bucopho",
                                    "KUMETHULA - MBANGWENI - Bucopho",
                                    "KUMETHULA - NKALANENI - Bucopho",
                                    "KUMETHULA - NKOMONYE - Bucopho",
                                    "KUMETHULA - NZAMEYA - Bucopho",

                                    //SHISELWENI BUCOPHO KUBUTA
                                    "KUBUTA - EZISHINENI - Bucopho",
                                    "KUBUTA - KAGWEBU - Bucopho",
                                    "KUBUTA - KAKHOLWANE - Bucopho",
                                    "KUBUTA - KAMBHOKE - Bucopho",
                                    "KUBUTA - KAPHUNGA - Bucopho",
                                    "KUBUTA - MANYEVENI - Bucopho",
                                    "KUBUTA - NGOBELWENI - Bucopho",
                                    "KUBUTA - NHLALABANTFU - Bucopho",

                                    //SHISELWENI BUCOPHO MASEYISINI
                                    "MASEYISINI - DLOVUNGA - Bucopho",
                                    "MASEYISINI - KA MZIZI - Bucopho",
                                    "MASEYISINI - MASIBINI - Bucopho",
                                    "MASEYISINI - MBILANENI - Bucopho",
                                    "MASEYISINI - SIMEMENI - Bucopho",
                                    "MASEYISINI - VUSWENI - Bucopho",

                                    //SHISELWENI BUCOPHO MATSANJENI SOUTH
                                    "MATSANJENI SOUTH - BAMBITJE - Bucopho",
                                    "MATSANJENI SOUTH - DINABANYE - Bucopho",
                                    "MATSANJENI SOUTH - KWALUSENI - Bucopho",
                                    "MATSANJENI SOUTH - NKONKA - Bucopho",
                                    "MATSANJENI SOUTH - NSALITJE - Bucopho",
                                    "MATSANJENI SOUTH - QOMINTABA - Bucopho",

                                    //SHISELWENI BUCOPHO MTSAMBAMA
                                    "MTSAMBAMA - BHANGANOMA - Bucopho",
                                    "MTSAMBAMA - EBENEZER - Bucopho",
                                    "MTSAMBAMA - KA ZENZILE - Bucopho",
                                    "MTSAMBAMA - KWEENDZENI - Bucopho",
                                    "MTSAMBAMA - MAGELE - Bucopho",

                                    //SHISELWENI BUCOPHO KAMHAWU
                                    "NGUDZENI - KA MHAWU - Bucopho",
                                    "NGUDZENI - KA MKHAYA - Bucopho",
                                    "NGUDZENI - KA MSHENGA - Bucopho",
                                    "NGUDZENI - LUSITINI - Bucopho",

                                    //SHISELWENI BUCOPHO BUSELENI
                                    "NKWENE - BUSELENI - Bucopho",
                                    "NKWENE - EKUPHUMLENI - Bucopho",
                                    "NKWENE - HLOBANE - Bucopho",
                                    "NKWENE - NKWENE - Bucopho",

                                    //SHISELWENI BUCOPHO SANDLENI
                                    "SANDLENI - EZIBONDENI KASHIBA - Bucopho",
                                    "SANDLENI - KAGWEGWE - Bucopho",
                                    "SANDLENI - NGOLOLWENI - Bucopho",
                                    "SANDLENI - NHLETJENI - Bucopho",
                                    "SANDLENI - NKHUNGWINI - Bucopho",

                                    //SHISELWENI BUCOPHO SHISELWENI 1
                                    "SHISELWENI - DUMENKUNGWINI - Bucopho",
                                    "SHISELWENI - EPOSINI - Bucopho",
                                    "SHISELWENI - HHUHHUMA - Bucopho",
                                    "SHISELWENI - MABONABULAWE - Bucopho",
                                    "SHISELWENI - MANYANDZENI - Bucopho",
                                    "SHISELWENI - MCHINSWENI - Bucopho",
                                    "SHISELWENI - ZIKHOTHENI - Bucopho",

                                    //SHISELWENI BUCOPHO SHISELWENI 2
                                    "SHISELWENI - MAHLALINI - Bucopho",
                                    "SHISELWENI - MAKHWELELA - Bucopho",
                                    "SHISELWENI - MATHENDELE - Bucopho",
                                    "SHISELWENI - MBABALA - Bucopho",
                                    "SHISELWENI - MBANGWENI - Bucopho",
                                    "SHISELWENI - MBEKA - Bucopho",
                                    "SHISELWENI - MKHITSINI - Bucopho",
                                    "SHISELWENI - MPANGISWENI - Bucopho",
                                    "SHISELWENI - SIKHOTSENI - Bucopho",

                                    //SHISELWENI BUCOPHO SIGWE
                                    "SIGWE - EKUPHUMLENI-ENJABULWENI - Bucopho",
                                    "SIGWE - LULAKENI - Bucopho",
                                    "SIGWE - NDUNAYITHINI - Bucopho",
                                    "SIGWE - NYATSINI - Bucopho",

                                    //SHISELWENI BUCOPHO SOMNTONGO
                                    "SOMNTONGO - ETJENI - Bucopho",
                                    "SOMNTONGO - LUHLEKWENI - Bucopho",
                                    "SOMNTONGO - MAPLOTINI - Bucopho",
                                    "SOMNTONGO - NSUBANE - Bucopho",
                                    "SOMNTONGO - NTUTHWAKAZI - Bucopho",
                                    "SOMNTONGO - PHANGWENI - Bucopho",
                                    "SOMNTONGO - VIMBIZIBUKO - Bucopho",

                                    //SHISELWENI BUCOPHO SOMNTONGO
                                    "ZOMBODZE EMUVA - BULEKENI - Bucopho",
                                    "ZOMBODZE EMUVA - MAMPONDWENI - Bucopho",
                                    "ZOMBODZE EMUVA - NGWENYAMENI - Bucopho",
                                    "ZOMBODZE EMUVA - ZOMBODZE - Bucopho",
                                ]}
                            />
                        </Document>
                    </PDFViewer>
                )}
            </ErrorBoundary>
        </div>
    );
}

export default ShiselweniResults;
