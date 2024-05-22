package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an IP
type SmartContract struct {
    contractapi.Contract
}

// IPAsset describes basic details of what makes up an IP asset
type IPAsset struct {
    ID              string `json:"id"`
    Title           string `json:"title"`
    Creator         string `json:"creator"`
    Owner           string `json:"owner"`
    CreationDate    string `json:"creation_date"`
    LicenseHolder   string `json:"license_holder"`
    LicenseStartDate string `json:"license_start_date"`
    LicenseEndDate   string `json:"license_end_date"`
}

// InitLedger adds a base set of IP assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    ipAssets := []IPAsset{
        {ID: "1", Title: "My First Book", Creator: "Author A", Owner: "Author A", CreationDate: "2023-01-01"},
        {ID: "2", Title: "My Second Song", Creator: "Artist B", Owner: "Artist B", CreationDate: "2023-02-01"},
    }

    for _, ipAsset := range ipAssets {
        ipAssetJSON, err := json.Marshal(ipAsset)
        if err != nil {
            return err
        }

        err = ctx.GetStub().PutState(ipAsset.ID, ipAssetJSON)
        if err != nil {
            return fmt.Errorf("failed to put to world state. %v", err)
        }
    }

    return nil
}

// CreateIPAsset issues a new IP asset to the world state with given details.
func (s *SmartContract) CreateIPAsset(ctx contractapi.TransactionContextInterface, id string, title string, creator string, owner string, creationDate string) error {
    ipAsset := IPAsset{
        ID:           id,
        Title:        title,
        Creator:      creator,
        Owner:        owner,
        CreationDate: creationDate,
    }

    ipAssetJSON, err := json.Marshal(ipAsset)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, ipAssetJSON)
}

// QueryIPAsset returns the IP asset stored in the world state with given id.
func (s *SmartContract) QueryIPAsset(ctx contractapi.TransactionContextInterface, id string) (*IPAsset, error) {
    ipAssetJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, fmt.Errorf("failed to read from world state: %v", err)
    }
    if ipAssetJSON == nil {
        return nil, fmt.Errorf("the IP asset %s does not exist", id)
    }

    var ipAsset IPAsset
    err = json.Unmarshal(ipAssetJSON, &ipAsset)
    if err != nil {
        return nil, err
    }

    return &ipAsset, nil
}

// TransferIPAsset updates the owner field of IP asset with given id in world state.
func (s *SmartContract) TransferIPAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
    ipAsset, err := s.QueryIPAsset(ctx, id)
    if err != nil {
        return err
    }

    ipAsset.Owner = newOwner

    ipAssetJSON, err := json.Marshal(ipAsset)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, ipAssetJSON)
}

// LicenseIPAsset adds a licensing agreement to the IP asset with given id.
func (s *SmartContract) LicenseIPAsset(ctx contractapi.TransactionContextInterface, id string, licenseHolder string, licenseStartDate string, licenseEndDate string) error {
    ipAsset, err := s.QueryIPAsset(ctx, id)
    if err != nil {
        return err
    }

    ipAsset.LicenseHolder = licenseHolder
    ipAsset.LicenseStartDate = licenseStartDate
    ipAsset.LicenseEndDate = licenseEndDate

    ipAssetJSON, err := json.Marshal(ipAsset)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, ipAssetJSON)
}

func main() {
    chaincode, err := contractapi.NewChaincode(new(SmartContract))
    if err != nil {
        fmt.Printf("Error creating IP chaincode: %s", err)
        return
    }

    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting IP chaincode: %s", err)
    }
}
