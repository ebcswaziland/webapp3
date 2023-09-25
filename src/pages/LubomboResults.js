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

function LubomboResults() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchNomineeData = async () => {
            try {
                const urls = [
                    //MP
                    "/Lubombo/Dvokodvweni/Secondary/MP/nominees",
                    "/Lubombo/Gilgal/Secondary/MP/nominees",
                    "/Lubombo/Lomahasha/Secondary/MP/nominees",
                    "/Lubombo/Lubuli/Secondary/MP/nominees",
                    "/Lubombo/Lugongolweni/Secondary/MP/nominees",
                    "/Lubombo/Matsanjeni_North/Secondary/MP/nominees",
                    "/Lubombo/Mhlume/Secondary/MP/nominees",
                    "/Lubombo/Mpolonjeni/Secondary/MP/nominees",
                    "/Lubombo/Nkilongo/Secondary/MP/nominees",
                    "/Lubombo/Siphofaneni/Secondary/MP/nominees",
                    "/Lubombo/Sithobela/Secondary/MP/nominees",


                    //Tindvuna
                    "/Lubombo/Dvokodvweni/Secondary/Indvuna/nominees",
                    "/Lubombo/Gilgal/Secondary/Indvuna/nominees",
                    "/Lubombo/Lomahasha/Secondary/Indvuna/nominees",
                    "/Lubombo/Lubuli/Secondary/Indvuna/nominees",
                    "/Lubombo/Lugongolweni/Secondary/Indvuna/nominees",
                    "/Lubombo/Matsanjeni_North/Secondary/Indvuna/nominees",
                    "/Lubombo/Mhlume/Secondary/Indvuna/nominees",
                    "/Lubombo/Mpolonjeni/Secondary/Indvuna/nominees",
                    "/Lubombo/Nkilongo/Secondary/Indvuna/nominees",
                    "/Lubombo/Siphofaneni/Secondary/Indvuna/nominees",
                    "/Lubombo/Sithobela/Secondary/Indvuna/nominees",


                    //bucopho Dvokodvweni
                    "/Lubombo/Dvokodvweni/Hlane/Bucopho/nominees",
                    "/Lubombo/Dvokodvweni/Malindza/Bucopho/nominees",
                    "/Lubombo/Dvokodvweni/Mdumezulu/Bucopho/nominees",
                    "/Lubombo/Dvokodvweni/Mhlangatane/Bucopho/nominees",
                    "/Lubombo/Dvokodvweni/Njabulweni/Bucopho/nominees",
                    "/Lubombo/Dvokodvweni/Ntandweni/Bucopho/nominees",

                    //Bucopho Gilgal
                    "/Lubombo/Gilgal/Bulunga/Bucopho/nominees",
                    "/Lubombo/Gilgal/Etjedze/Bucopho/nominees",
                    "/Lubombo/Gilgal/Hlutse/Bucopho/nominees",
                    "/Lubombo/Gilgal/Mabondvweni/Bucopho/nominees",
                    "/Lubombo/Gilgal/Macetjeni/Bucopho/nominees",
                    "/Lubombo/Gilgal/Sigcaweni/Bucopho/nominees",
                    "/Lubombo/Gilgal/Vikizijula/Bucopho/nominees",

                    //Bucopho Lomahasha
                    "/Lubombo/Lomahasha/Lomahasha/Bucopho/nominees",
                    "/Lubombo/Lomahasha/Shewula/Bucopho/nominees",

                    //Bucopho Lubuli
                    "/Lubombo/Lubuli/KaVuma/Bucopho/nominees",
                    "/Lubombo/Lubuli/Mabantaneni/Bucopho/nominees",
                    "/Lubombo/Lubuli/Nsoko/Bucopho/nominees",
                    "/Lubombo/Lubuli/Ntuthwakazi/Bucopho/nominees",

                    //Bucopho Lugongolweni
                    "/Lubombo/Lugongolweni/KaLanga/Bucopho/nominees",
                    "/Lubombo/Lugongolweni/Makhewu/Bucopho/nominees",
                    "/Lubombo/Lugongolweni/Mlindazwe/Bucopho/nominees",
                    "/Lubombo/Lugongolweni/Sitsatsaweni/Bucopho/nominees",

                    //Bucopho matsanjeni North
                    "/Lubombo/Matsanjeni_North/Lukhetseni/Bucopho/nominees",
                    "/Lubombo/Matsanjeni_North/Mambane/Bucopho/nominees",
                    "/Lubombo/Matsanjeni_North/Maphungwane/Bucopho/nominees",
                    "/Lubombo/Matsanjeni_North/Tikhuba/Bucopho/nominees",

                    //Bucopho Mhlume
                    "/Lubombo/Mhlume/Mafucula/Bucopho/nominees",
                    "/Lubombo/Mhlume/Mhlume/Bucopho/nominees",
                    "/Lubombo/Mhlume/Simunye/Bucopho/nominees",
                    "/Lubombo/Mhlume/Tambankulu/Bucopho/nominees",
                    "/Lubombo/Mhlume/Tsambokhulu/Bucopho/nominees",
                    "/Lubombo/Mhlume/Tshaneni/Bucopho/nominees",
                    "/Lubombo/Mhlume/Vuvulane/Bucopho/nominees",

                    //Bucopho Mpolonjeni
                    "/Lubombo/Mpolonjeni/KaShoba/Bucopho/nominees",
                    "/Lubombo/Mpolonjeni/Mpolonjeni/Bucopho/nominees",
                    "/Lubombo/Mpolonjeni/Ndzangu/Bucopho/nominees",
                    "/Lubombo/Mpolonjeni/Ngcina/Bucopho/nominees",
                    "/Lubombo/Mpolonjeni/Sigcaweni_East/Bucopho/nominees",

                    //Bucopho Nkilongo
                    "/Lubombo/Nkilongo/Crooks_Plantations/Bucopho/nominees",
                    "/Lubombo/Nkilongo/Gamula/Bucopho/nominees",
                    "/Lubombo/Nkilongo/Illovo_Mayaluka/Bucopho/nominees",
                    "/Lubombo/Nkilongo/Lunkuntfu/Bucopho/nominees",
                    "/Lubombo/Nkilongo/Nkhanini_Lusabeni/Bucopho/nominees",
                    "/Lubombo/Nkilongo/Phafeni/Bucopho/nominees",

                    //Bucopho Siphofaneni
                    "/Lubombo/Siphofaneni/KaMkhweli/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Madlenya/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Maphilingo/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Mphumakudze/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Nceka/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Ngevini/Bucopho/nominees",
                    "/Lubombo/Siphofaneni/Tambuti/Bucopho/nominees",

                    //Bucopho Sithobela
                    "/Lubombo/Sithobela/Luhlanyeni/Bucopho/nominees",
                    "/Lubombo/Sithobela/Mamisa/Bucopho/nominees",
                    "/Lubombo/Sithobela/Nkonjwa/Bucopho/nominees",
                    "/Lubombo/Sithobela/Nokwane/Bucopho/nominees",
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
                                    "Dvokodvweni - MP",
                                    "Gilgal - MP",
                                    "Lomahasha - MP",
                                    "Lubuli - MP",
                                    "Lugongolweni - MP",
                                    "Matsanjeni North - MP",
                                    "Mhlume - MP",
                                    "Mpolonjeni - MP",
                                    "Nkilongo - MP",
                                    "Siphofaneni - MP",
                                    "Sithobela - MP",


                                    //Indvuna
                                    "Dvokodvweni - INDVUNA",
                                    "Gilgal - INDVUNA",
                                    "Lomahasha - INDVUNA",
                                    "Lubuli - INDVUNA",
                                    "Lugongolweni - INDVUNA",
                                    "Matsanjeni North - INDVUNA",
                                    "Mhlume - INDVUNA",
                                    "Mpolonjeni - INDVUNA",
                                    "Nkilongo - INDVUNA",
                                    "Siphofaneni - INDVUNA",
                                    "Sithobela - INDVUNA",


                                    //bucopho
                                    "Dvokodvweni - Hlane - Bucopho",
                                    "Dvokodvweni - Malindza - Bucopho",
                                    "Dvokodvweni - Mdumezulu - Bucopho",
                                    "Dvokodvweni - Mhlangatane - Bucopho",
                                    "Dvokodvweni - Njabulweni - Bucopho",
                                    "Dvokodvweni - Ntandweni - Bucopho",

                                    "Gilgal - Bulunga - Bucopho",
                                    "Gilgal - Etjedze - Bucopho",
                                    "Gilgal - Hlutse - Bucopho",
                                    "Gilgal - Mabondvweni - Bucopho",
                                    "Gilgal - Macetjeni - Bucopho",
                                    "Gilgal - Sigcaweni - Bucopho",
                                    "Gilgal - Vikizijula - Bucopho",

                                    "Lomahasha - Lomahasha - Bucopho",
                                    "Lomahasha - Shewula - Bucopho",

                                    "Lubuli - KaVuma - Bucopho",
                                    "Lubuli - Mabantaneni - Bucopho",
                                    "Lubuli - Nsoko - Bucopho",
                                    "Lubuli - Ntuthwakazi - Bucopho",

                                    "Lugongolweni - KaLanga - Bucopho",
                                    "Lugongolweni - Makhewu - Bucopho",
                                    "Lugongolweni - Mlindazwe - Bucopho",
                                    "Lugongolweni - Sitsatsaweni - Bucopho",

                                    "Matsanjeni North - Lukhetseni - Bucopho",
                                    "Matsanjeni North - Mambane - Bucopho",
                                    "Matsanjeni North - Maphungwane - Bucopho",
                                    "Matsanjeni North - Tikhuba - Bucopho",

                                    "Mhlume - Mafucula - Bucopho",
                                    "Mhlume - Mhlume - Bucopho",
                                    "Mhlume - Simunye - Bucopho",
                                    "Mhlume - Tambankulu - Bucopho",
                                    "Mhlume - Tsambokhulu - Bucopho",
                                    "Mhlume - Tshaneni - Bucopho",
                                    "Mhlume - Vuvulane - Bucopho",

                                    "Mpolonjeni - KaShoba - Bucopho",
                                    "Mpolonjeni - Mpolonjeni - Bucopho",
                                    "Mpolonjeni - Ndzangu - Bucopho",
                                    "Mpolonjeni - Ngcina - Bucopho",
                                    "Mpolonjeni - Sigcaweni East - Bucopho",

                                    "Nkilongo - Crooks Plantations - Bucopho",
                                    "Nkilongo - Gamula - Bucopho",
                                    "Nkilongo - Illovo Mayaluka - Bucopho",
                                    "Nkilongo - Lunkuntfu - Bucopho",
                                    "Nkilongo - Nkhanini Lusabeni - Bucopho",
                                    "Nkilongo - Phafeni - Bucopho",

                                    "Siphofaneni - KaMkhweli - Bucopho",
                                    "Siphofaneni - Madlenya - Bucopho",
                                    "Siphofaneni - Maphilingo - Bucopho",
                                    "Siphofaneni - Mphumakudze - Bucopho",
                                    "Siphofaneni - Nceka - Bucopho",
                                    "Siphofaneni - Ngevini - Bucopho",
                                    "Siphofaneni - Tambuti - Bucopho",

                                    "Sithobela - Luhlanyeni - Bucopho",
                                    "Sithobela - Mamisa - Bucopho",
                                    "Sithobela - Nkonjwa - Bucopho",
                                    "Sithobela - Nokwane - Bucopho",

                                ]}
                            />
                        </Document>
                    </PDFViewer>
                )}
            </ErrorBoundary>
        </div>
    );
}

export default LubomboResults;
