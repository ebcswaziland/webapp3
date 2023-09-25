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

function HhohhoResults() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchNomineeData = async () => {
            try {
                const urls = [
                    //MP
                    "/Hhohho/Hhukwini/Secondary/MP/nominees",
                    "/Hhohho/Lobamba/Secondary/MP/nominees",
                    "/Hhohho/Madlangempisi/Secondary/MP/nominees",
                    "/Hhohho/Maphalaleni/Secondary/MP/nominees",
                    "/Hhohho/Mayiwane/Secondary/MP/nominees",
                    "/Hhohho/Mbabane_East/Secondary/MP/nominees",
                    "/Hhohho/Mbabane_West/Secondary/MP/nominees",
                    "/Hhohho/Mhlangatane/Secondary/MP/nominees",
                    "/Hhohho/Motshane/Secondary/MP/nominees",
                    "/Hhohho/Ndzingeni/Secondary/MP/nominees",
                    "/Hhohho/Nkhaba/Secondary/MP/nominees",
                    "/Hhohho/Ntfonjeni/Secondary/MP/nominees",
                    "/Hhohho/Piggs_Peak/Secondary/MP/nominees",
                    "/Hhohho/Siphocosini/Secondary/MP/nominees",
                    "/Hhohho/Timphisini/Secondary/MP/nominees",

                    //Tindvuna
                    "/Hhohho/Hhukwini/Secondary/Indvuna/nominees",
                    "/Hhohho/Lobamba/Secondary/Indvuna/nominees",
                    "/Hhohho/Madlangempisi/Secondary/Indvuna/nominees",
                    "/Hhohho/Maphalaleni/Secondary/Indvuna/nominees",
                    "/Hhohho/Mayiwane/Secondary/Indvuna/nominees",
                    "/Hhohho/Mbabane_East/Secondary/Indvuna/nominees",
                    "/Hhohho/Mbabane_West/Secondary/Indvuna/nominees",
                    "/Hhohho/Mhlangatane/Secondary/Indvuna/nominees",
                    "/Hhohho/Motshane/Secondary/Indvuna/nominees",
                    "/Hhohho/Ndzingeni/Secondary/Indvuna/nominees",
                    "/Hhohho/Nkhaba/Secondary/Indvuna/nominees",
                    "/Hhohho/Ntfonjeni/Secondary/Indvuna/nominees",
                    "/Hhohho/Piggs_Peak/Secondary/Indvuna/nominees",
                    "/Hhohho/Siphocosini/Secondary/Indvuna/nominees",
                    "/Hhohho/Timphisini/Secondary/Indvuna/nominees",

                    //bucopho hhukwini
                    "/Hhohho/Hhukwini/Dlangeni/Bucopho/nominees",
                    "/Hhohho/Hhukwini/KaSiko/Bucopho/nominees",
                    "/Hhohho/Hhukwini/LaMgabhi/Bucopho/nominees",
                    "/Hhohho/Hhukwini/Sitseni/Bucopho/nominees",

                    //bucopho lobamba
                    "/Hhohho/Lobamba/Elangeni/Bucopho/nominees",
                    "/Hhohho/Lobamba/Ezabeni/Bucopho/nominees",
                    "/Hhohho/Lobamba/Ezulwini/Bucopho/nominees",
                    "/Hhohho/Lobamba/Lobamba/Bucopho/nominees",
                    "/Hhohho/Lobamba/Nkhanini/Bucopho/nominees",

                    //bucopho madlangempisi
                    "/Hhohho/Madlangempisi/Dvokolwako_Ekuphakameni/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Ekukhulumeni_Mzaceni/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Gucuka/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Mavula/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Nyonyane_Maguga/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Tfuntini_Buhlebuyeza/Bucopho/nominees",
                    "/Hhohho/Madlangempisi/Zandondo/Bucopho/nominees",

                    //bucopho maphalaleni
                    "/Hhohho/Maphalaleni/Edlozini/Bucopho/nominees",
                    "/Hhohho/Maphalaleni/Madlolo/Bucopho/nominees",
                    "/Hhohho/Maphalaleni/Maphalaleni/Bucopho/nominees",
                    "/Hhohho/Maphalaleni/Mcengeni/Bucopho/nominees",
                    "/Hhohho/Maphalaleni/Mfeni/Bucopho/nominees",
                    "/Hhohho/Maphalaleni/Nsingweni/Bucopho/nominees",

                    //bucopho mayiwane
                    "/Hhohho/Mayiwane/Hereford's/Bucopho/nominees",
                    "/Hhohho/Mayiwane/Mavula/Bucopho/nominees",
                    "/Hhohho/Mayiwane/Mfasini/Bucopho/nominees",
                    "/Hhohho/Mayiwane/Mkhuzweni/Bucopho/nominees",
                    "/Hhohho/Mayiwane/Mkhweni/Bucopho/nominees",

                    //bucopho mbabane east
                    "/Hhohho/Mbabane_East/Fonteyn/Bucopho/nominees",
                    "/Hhohho/Mbabane_East/Mdzimba_Lofokati/Bucopho/nominees",
                    "/Hhohho/Mbabane_East/Msunduza/Bucopho/nominees",
                    "/Hhohho/Mbabane_East/Sidvwashini/Bucopho/nominees",

                    //bucopho mbabane west
                    "/Hhohho/Mbabane_West/Mangwaneni/Bucopho/nominees",
                    "/Hhohho/Mbabane_West/Manzana/Bucopho/nominees",
                    "/Hhohho/Mbabane_West/Nkwalini/Bucopho/nominees",

                    //bucopho mhlangatane
                    "/Hhohho/Mhlangatane/Malibeni/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Mangweni/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Mphofu/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Ndvwabangeni/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Nhlanguyavuka/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Nyakatfo/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Sidvwashini/Bucopho/nominees",
                    "/Hhohho/Mhlangatane/Zinyane/Bucopho/nominees",

                    // //bucopho motshane
                    "/Hhohho/Motshane/Kupheleni/Bucopho/nominees",
                    "/Hhohho/Motshane/Mpolonjeni/Bucopho/nominees",
                    "/Hhohho/Motshane/Nduma/Bucopho/nominees",

                    // //bucopho ndzingeni
                    "/Hhohho/Ndzingeni/Bulandzeni/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Kwaliweni/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Ludlawini/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Meleti/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Mgungundlovu/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Mvuma/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Nkamanzi/Bucopho/nominees",
                    "/Hhohho/Ndzingeni/Ntsanjeni/Bucopho/nominees",

                    // //bucopho nkhaba
                    "/Hhohho/Nkhaba/Ejubukweni/Bucopho/nominees",
                    "/Hhohho/Nkhaba/Ekuvinjelweni/Bucopho/nominees",
                    "/Hhohho/Nkhaba/Malanti/Bucopho/nominees",
                    "/Hhohho/Nkhaba/Nkhaba/Bucopho/nominees",

                    //bucopho ntfonjeni
                    "/Hhohho/Ntfonjeni/Emvembili/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/Hhelehhele/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/KaNdwandwa/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/Ka_Hhohho/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/Lomshiyo/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/Mshingishingini/Bucopho/nominees",
                    "/Hhohho/Ntfonjeni/Vusweni/Bucopho/nominees",

                    //bucopho piggs'peak
                    "/Hhohho/Piggs_Peak/Bulembu_Luhhumaneni_1/Bucopho/nominees",
                    "/Hhohho/Piggs_Peak/Luhhumaneni_Kandeva/Bucopho/nominees",
                    "/Hhohho/Piggs_Peak/Luhlangotsini/Bucopho/nominees",
                    "/Hhohho/Piggs_Peak/Nginamadvolo/Bucopho/nominees",
                    "/Hhohho/Piggs_Peak/Nsangwini/Bucopho/nominees",
                    "/Hhohho/Piggs_Peak/Piggs_Peak/Bucopho/nominees",

                    //bucopho siphocosini
                    "/Hhohho/Siphocosini/Luhlendlweni/Bucopho/nominees",
                    "/Hhohho/Siphocosini/Mantabeni/Bucopho/nominees",
                    "/Hhohho/Siphocosini/Sigangeni/Bucopho/nominees",
                    "/Hhohho/Siphocosini/Siphocosini/Bucopho/nominees",

                    //bucopho timphisini
                    "/Hhohho/Timphisini/Hhohho/Bucopho/nominees",
                    "/Hhohho/Timphisini/Ludzibini/Bucopho/nominees",
                    "/Hhohho/Timphisini/Mashobeni_North/Bucopho/nominees",
                    "/Hhohho/Timphisini/Mvembili/Bucopho/nominees",
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
                                    //MP
                                    "HHUKWINI - MP",
                                    "LOBAMBA - MP",
                                    "Madlangempisi - MP",
                                    "Maphalaleni - MP",
                                    "Mayiwane - MP",
                                    "Mbabane East - MP",
                                    "Mbabane West - MP",
                                    "Mhlangatane - MP",
                                    "Motshane - MP",
                                    "Ndzingeni - MP",
                                    "Nkhaba - MP",
                                    "Ntfonjeni - MP",
                                    "Piggs Peak - MP",
                                    "Siphocosini - MP",
                                    "Timphisini - MP",

                                    //Indvuna
                                    "HHUKWINI - INDVUNA",
                                    "LOBAMBA - INDVUNA",
                                    "Madlangempisi - INDVUNA",
                                    "Maphalaleni - INDVUNA",
                                    "Mayiwane - INDVUNA",
                                    "Mbabane East - INDVUNA",
                                    "Mbabane West - INDVUNA",
                                    "Mhlangatane - INDVUNA",
                                    "Motshane - INDVUNA",
                                    "Ndzingeni - INDVUNA",
                                    "Nkhaba - INDVUNA",
                                    "Ntfonjeni - INDVUNA",
                                    "Piggs Peak - INDVUNA",
                                    "Siphocosini - INDVUNA",
                                    "Timphisini - INDVUNA",

                                    //bucopho hhukwini
                                    "HHUKWINI - DLANGENI - Bucopho",
                                    "HHUKWINI - KaSiko - Bucopho",
                                    "HHUKWINI - LaMgabhi - Bucopho",
                                    "HHUKWINI - Sitseni - Bucopho",

                                    //bucopho lobamba
                                    "LOBAMBA - ELANGENI - Bucopho",
                                    "LOBAMBA - EZABENI - Bucopho",
                                    "LOBAMBA - EZULWINI - Bucopho",
                                    "LOBAMBA - LOBAMBA - Bucopho",
                                    "LOBAMBA - NKHANINI - Bucopho",

                                    //bucopho madlangempisi
                                    "MADLANGEMPISI - DVOKOLWAKO-EKUPHAKAMENI - Bucopho",
                                    "MADLANGEMPISI - EKUKHULUMENI/MZACENI - Bucopho",
                                    "MADLANGEMPISI - GUCUKA - Bucopho",
                                    "MADLANGEMPISI - MAVULA - Bucopho",
                                    "MADLANGEMPISI - NYONYANE - Bucopho",
                                    "MADLANGEMPISI - TFUNTINI - Bucopho",
                                    "MADLANGEMPISI - ZANDONDO - Bucopho",

                                    //bucopho maphalaleni
                                    "MAPHALALENI - EDLOZINI - Bucopho",
                                    "MAPHALALENI - MADLOLO - Bucopho",
                                    "MAPHALALENI - MAPHALALANI - Bucopho",
                                    "MAPHALALENI - MCENGENI - Bucopho",
                                    "MAPHALALENI - MFENI - Bucopho",
                                    "MAPHALALENI - NSINGWENI - Bucopho",

                                    //bucopho mayiwane
                                    "MAYIWANE - HEREFORD'S - Bucopho",
                                    "MAYIWANE - MAVULA - Bucopho",
                                    "MAYIWANE - MAFASINI - Bucopho",
                                    "MAYIWANE - MKHUZWENI - Bucopho",
                                    "MAYIWANE - MKHWENI - Bucopho",

                                    //bucopho mbabane east
                                    "MBABANE EAST - FONTEYN - Bucopho",
                                    "MBABANE EAST - MDZIMBA - Bucopho",
                                    "MBABANE EAST - MSUNDUZA - Bucopho",
                                    "MBABANE EAST - SIDVWASHINI - Bucopho",

                                    //bucopho mbabane west
                                    "MBABANE WEST - MANGWANENI - Bucopho",
                                    "MBABANE WEST - MANZANA - Bucopho",
                                    "MBABANE WEST - NKWALINI - Bucopho",

                                    //bucopho mhlangatane
                                    "MHLANGATANE - MALIBENI - Bucopho",
                                    "MHLANGATANE - MANGWENI - Bucopho",
                                    "MHLANGATANE - MPHOFU - Bucopho",
                                    "MHLANGATANE - NYAKATFO - Bucopho",
                                    "MHLANGATANE - SIDVWASHINI - Bucopho",
                                    "MHLANGATANE - ZINYANE - Bucopho",
                                    "MHLANGATANE - NDVWABANGENI - Bucopho",
                                    "MHLANGATANE - NHLANGUYAVUKA - Bucopho",

                                    //bucopho motshane
                                    "MOTSHANE - KUPHELENI - Bucopho",
                                    "MOTSHANE - MPOLONJENI - Bucopho",
                                    "MOTSHANE - NDUMA - Bucopho",

                                    //bucopho ndzingeni
                                    "NDZINGENI - BULANDZENI - Bucopho",
                                    "NDZINGENI - KWALIWENI - Bucopho",
                                    "NDZINGENI - LUDLAWINI - Bucopho",
                                    "NDZINGENI - MELETI - Bucopho",
                                    "NDZINGENI - MGUNGUNDLOVU - Bucopho",
                                    "NDZINGENI - MVUMA - Bucopho",
                                    "NDZINGENI - NKAMANZI - Bucopho",
                                    "NDZINGENI - NTSANJENI - Bucopho",

                                    //bucopho nkhaba
                                    "NKHABA - EJUBUKWENI - Bucopho",
                                    "NKHABA - EKUVINJELWENI - Bucopho",
                                    "NKHABA - MALANTI - Bucopho",
                                    "NKHABA - NKHABA - Bucopho",

                                    //bucopho ntfonjeni
                                    "NTFONJENI - EMVEMBILI - Bucopho",
                                    "NTFONJENI - HHELEHHELE - Bucopho",
                                    "NTFONJENI - KANDWANDWA - Bucopho",
                                    "NTFONJENI - KA_HHOHHO - Bucopho",
                                    "NTFONJENI - LOMSHIYO - Bucopho",
                                    "NTFONJENI - MSHINGISHINGINI - Bucopho",
                                    "NTFONJENI - VUSWENI - Bucopho",

                                    //bucopho piggs'peak
                                    "PIGGS'PEAK - BULEMBU_LUHUMANENI_1 - Bucopho",
                                    "PIGGS'PEAK - LUHUMANENI_KANDEVA - Bucopho",
                                    "PIGGS'PEAK - LUHLANGOTSINI - Bucopho",
                                    "PIGGS'PEAK - NGINAMADVOLO - Bucopho",
                                    "PIGGS'PEAK - NSANGWINI - Bucopho",
                                    "PIGGS'PEAK - PIGGS'PEAK - Bucopho",

                                    //bucopho siphocosini
                                    "SIPHOCOSINI - LUHLENDWENI - Bucopho",
                                    "SIPHOCOSINI - MANTABENI - Bucopho",
                                    "SIPHOCOSINI - SIGANGENI - Bucopho",
                                    "SIPHOCOSINI - SIPHOCOSINI - Bucopho",

                                    //bucopho timphisini
                                    "TIMPHISINI - HHOHHO - Bucopho",
                                    "TIMPHISINI - LUDZIBINI - Bucopho",
                                    "TIMPHISINI - MASHOBENI_NORTH - Bucopho",
                                    "TIMPHISINI - MVEMBILI - Bucopho",
                                ]}
                            />
                        </Document>
                    </PDFViewer>
                )}
            </ErrorBoundary>
        </div>
    );
}

export default HhohhoResults;
