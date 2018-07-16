package com.namowebiz.mugrun.applications.siteadmin.service.sitefile;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.siteadmin.dao.sitefile.SiteFileDao;
import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.FileInfoBean;
import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.SiteFile;
import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.SiteFileVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 사이트 파일관리 Service
 * @author jipark
 * @since 2.6
 */
@Service
public class SiteFileService {
	@Autowired
	private SiteFileDao dao;
	
	/**
	 * 사이트 파일정보 생성
	 * @param model 파일정보
	 * @return 생성 파일번호
	 * @throws Exception
	 */
	public void addFile(SiteFile model) throws Exception {
		dao.addFile(model);
	}
	
	/**
	 * 사이트 파일정보 생성
	 * @param fileBean 업로드 파일정보
	 * @param vo 추가 파일정보
	 * @return 생성 파일번호
	 * @throws Exception
	 */
	public void addFile(FileInfoBean fileBean, SiteFileVO vo) throws Exception {
		SiteFile model = new SiteFile();

		model.setBdConfigNo(vo.getBdConfigNo());
		model.setFileUseType(vo.getFileUseType());
		model.setFilePath(fileBean.getRurl());
		model.setOriginalFileName(fileBean.getOrgNm());
		model.setFileExtType(fileBean.getExt());
		model.setFileSize(fileBean.getSize());
		model.setBdContentNo(vo.getBdContentNo());
		model.setMemo(vo.getMemo());
		model.setFileAltTag(vo.getFileAltTag());
		model.setFileViewType(fileBean.getFileViewType());	//파일출력유형
		model.setThumbnailFilePath(fileBean.getThumbFilepath());	//썸네일파일Path
		model.setFileDelYn(CommonConstants.USE_NO);	//파일삭제여부(사용중)
		model.setRegDate(new Date(System.currentTimeMillis()));
		model.setRegUserNo(vo.getRegUserNo());
		model.setBigFileType(fileBean.getBigFileType());
		
		dao.addFile(model);
		
	}
	
	/**
	 * 다건의 파일정보 생성
	 * @param fileList 파일정보 리스트
	 * @throws Exception
	 */
	@Transactional
	public void addFileList(List<SiteFile> fileList) throws Exception {
		if(fileList == null)
			return;
		
		SiteFile model;
		for(int i=0; i<fileList.size(); i++) {
			model = (SiteFile)fileList.get(i);
			dao.addFile(model);
		}
	}
	
	/**
	 * 파일정보 삭제
	 * @param fileNo 파일번호
	 * @throws Exception
	 */
	public void deleteFile(Long fileNo) throws Exception {
		dao.deleteFile(fileNo);
	}
	
	/**
	 * 해당 모듈의 파일정보 삭제
	 * @param vo 삭제조건(모듈명,파일path)
	 * @throws Exception
	 */
	public void deleteFileOfModule(SiteFileVO vo) throws Exception {
		dao.deleteFileOfModule(vo);
	}
	
	/**
	 * 파일정보 조회
	 * @param fileNo 파일번호
	 * @return 파일정보
	 * @throws Exception
	 */
	public SiteFile getSiteFile(Long fileNo) throws Exception {
		if(fileNo == null || fileNo <= 0L)
			return null;
		
		return dao.getSiteFile(fileNo);
	}
	
	/**
	 * 파일정보 리스트 조회
	 * @param arrFileNo 파일번호 리스트
	 * @return 파일정보 리스트
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<SiteFile> getSiteFiles(Long[] arrFileNo) throws Exception {
		if(arrFileNo == null || arrFileNo.length == 0)
			return null;

		Map<String, Object> param = new HashMap<>();
		param.put("arrFileNo", arrFileNo);
		
		return dao.getSiteFiles(param);
	}
	
	/**
	 * 해당 모듈의 모든 파일정보 변경
	 * @param vo 파일 변경정보
	 * @throws Exception
	 */
	public void modifyFileOfAllModule(SiteFileVO vo) throws Exception {
		dao.modifyFileOfAllModule(vo);
	}
	
	/**
	 * 해당 모듈의 파일정보 변경
	 * @param vo 파일 변경정보(파일path,신규파일path)
	 * @throws Exception
	 */
	public void modifyFileOfModule(SiteFileVO vo) throws Exception {
		dao.modifyFileOfModule(vo);
	}
	
	/**
	 * 해당 모듈에서 등록한 파일정보 리스트 조회
	 * @param vo 조회조건(모듈명(tableId),모듈Key)
	 * @return 파일정보 리스트
	 * @throws Exception
	 */
	public List<SiteFile> getSiteFileListOfModule(SiteFileVO vo) throws Exception {
		return dao.getSiteFileListOfModule(vo);
	}
	
	public List<SiteFile> getSiteFileListOfModule(String fileUseType, Long fileUseRefNo) throws Exception {
		SiteFileVO vo = new SiteFileVO();
		vo.setFileUseType(fileUseType);
		vo.setFileUseRefNo(fileUseRefNo);
		
		return dao.getSiteFileListOfModule(vo);
	}
	
	public List<SiteFile> getSiteFileListOfModule(String fileUseType, Long fileUseRefNo, Long fileDelYn) throws Exception {
		SiteFileVO vo = new SiteFileVO();
		vo.setFileUseType(fileUseType);
		vo.setFileUseRefNo(fileUseRefNo);
		vo.setFileDelYn(fileDelYn);
		
		return dao.getSiteFileListOfModule(vo);
	}
	
	/**
	 * 업로드 제한 확장자 목록을 가져온다.
	 * @return String[] bannedFileExtentions
	 * @throws Exception
	 */
	public String[] getBannedFileExtentions() throws Exception {
		// 배열로 변환
		String bannedFileExtentions = dao.getBannedFileExtentions();
		return bannedFileExtentions.split(",");
	}
	/**
	 * 허용한 업로드 가능한 파일확장자 인지 체크
	 * @param fileExt 파일확장자
	 * @return 업로드 가능여부
	 * @throws Exception
	 */
	public boolean isUploadableExtention(String fileExt) throws Exception {
		boolean isUploadable = true;
		
		String bannedExt = dao.getBannedFileExtentions();
		if( !StringUtil.isEmpty(bannedExt) ) {
			bannedExt = bannedExt.toLowerCase();
			fileExt = fileExt.toLowerCase();
			
			if(bannedExt.indexOf(fileExt) >= 0)
				isUploadable = false;
		}
		
		return isUploadable;
	}
	
	/**
	 * 사이트에서 사용중인 모든 파일의 용량 총합을 구하여 반환
	 * @param passId
	 * @return
	 * @throws Exception
	 */
	public Long getSiteTotalFileUsage(String passId) throws Exception {
		return dao.getSiteTotalFileUsage(passId);
	}
	
	/**
	 * 유효기간 지난 파일 목록 반환
	 * @param fileDue
	 * @param bigFileType
	 * @return
	 * @throws Exception
	 */
	public List<SiteFile> getOverdueFileList(Long fileDue,String bigFileType) throws Exception {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("fileDue", fileDue);
		if (!StringUtil.isEmpty(bigFileType)) paramMap.put("bigFileType", bigFileType);
		return dao.getOverdueFileList(paramMap);
	}
	
	/**
	 * 유효기간 지난 파일 제거
	 * @param fileDue
	 * @param bigFileType
	 * @throws Exception
	 */
	public void deleteOverdueFiles(Long fileDue,String bigFileType) throws Exception {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("fileDue", fileDue);
		if (!StringUtil.isEmpty(bigFileType)) paramMap.put("bigFileType", bigFileType);
		dao.updateOverdueFileFlag(paramMap);
	}

	public SiteFile getFirstBoardFile(Long boardContentNo) {
		return dao.getFirstBoardFile(boardContentNo);
	}

	public SiteFile getFirstBoardImageFile(Long boardContentNo) {
		return dao.getFirstBoardImageFile(boardContentNo);
	}

}
