import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { API } from 'tapioca-sdk';
import { TContract, TProjectDeployment } from 'tapioca-sdk/dist/api/exportSDK';

export const getDeployments = async (_hre: HardhatRuntimeEnvironment) => {
    const { deployments } = _hre;
    const all = await deployments.all();
    return Promise.all(
        Object.keys(all).map(async (e) => ({
            name: e,
            address: all[e].address,
        })),
    );
};

/**
 * Script used to generate typings for the tapioca-sdk
 * https://github.com/Tapioca-DAO/tapioca-sdk
 */
export const exportSDK__task = async (
    taskArgs: any,
    hre: HardhatRuntimeEnvironment,
) => {
    const _deployments: TProjectDeployment = {
        [(await hre.getChainId()) as keyof TProjectDeployment]: (
            await getDeployments(hre)
        ).map(
            (e): TContract => ({
                address: e.address,
                meta: {},
                name: e.name,
            }),
        ),
    };
    await API.exportSDK.run({
        projectCaller: 'TapiocaZ',
        contractNames: [
            'YieldBox',
            'BeachBar',
            'Mixologist',
            'MixologistHelper',
            'ERC20',
            'ERC20Mock',
        ],
        artifactPath: hre.config.paths.artifacts,
        _deployments,
    });
};
